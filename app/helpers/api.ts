import appleAuth from '@invertase/react-native-apple-authentication';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import db, {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import moment from 'moment';
import {Alert} from 'react-native';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import Snackbar from 'react-native-snackbar';
import {WeeklyItems} from '../reducers/profile';
import Chat from '../types/Chat';
import Education from '../types/Education';
import Exercise from '../types/Exercise';
import Message from '../types/Message';
import Profile from '../types/Profile';
import QuickRoutine from '../types/QuickRoutines';
import {SavedQuickRoutine, SavedTest, SavedWorkout} from '../types/SavedItem';
import {CoolDown, Goal, Level, Recipe, WarmUp} from '../types/Shared';
import Test from '../types/Test';
import chunkArrayInGroups from './chunkArrayIntoGroups';

GoogleSignin.configure({
  webClientId:
    '48631950986-ibg0u91q5m6hsllkunhe9frf00id7r8c.apps.googleusercontent.com', // From Firebase Console Settings
});

export const appleSignIn = async () => {
  try {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw 'Apple Sign-In failed - no identify token returned';
    }

    // Create a Firebase credential from the response
    const {identityToken, nonce} = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    // Sign the user in with the credential
    return auth().signInWithCredential(appleCredential);
  } catch (e) {
    if (e instanceof Error) {
      Alert.alert('Error', e.message);
    }
    throw e;
  }
};

export const facebookSignIn = async () => {
  try {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );
    // Sign-in the user with the credential
    const credentials = await auth().signInWithCredential(facebookCredential);
    return credentials;
  } catch (e) {
    if (e !== 'User cancelled the login process') {
      if (e instanceof Error) {
        Alert.alert('Error', e.message);
      }
    }
    throw e;
  }
};

export const googleSignIn = async () => {
  // Get the users ID token
  try {
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const credentials = await auth().signInWithCredential(googleCredential);
    return credentials;
  } catch (e) {
    // @ts-ignore
    if (e.code !== statusCodes.SIGN_IN_CANCELLED) {
      if (e instanceof Error) {
        Alert.alert('Error', e.message);
      }
    }
    throw e;
  }
};

export const signIn = async (
  username: string,
  pass: string,
  handleAuthAction: (user: FirebaseAuthTypes.User) => void,
) => {
  try {
    if (username && pass) {
      const {user} = await auth().signInWithEmailAndPassword(username, pass);
      if (!user.emailVerified) {
        throw Error(
          'You must first verify your email using the link we sent you before logging in, please also check your spam folder',
        );
      } else {
        handleAuthAction(user);
      }
    } else {
      throw Error('Please enter both your email and your password');
    }
  } catch (e) {
    if (e instanceof Error) {
      Alert.alert('Sorry', e.message);
    }
    throw e;
  }
};

export const getUser = (uid: string) => {
  return db().collection('users').doc(uid).get();
};

export const setUser = (user: Profile) => {
  return db().collection('users').doc(user.uid).set(user);
};

export const updateUser = (user: any, uid: string) => {
  return db()
    .collection('users')
    .doc(uid)
    .update({
      ...user,
      birthday: moment(user.dob).dayOfYear(),
    });
};

export const createUser = async (
  email: string,
  password: string,
  extraData: object,
) => {
  const {user} = await auth().createUserWithEmailAndPassword(email, password);
  const reminderTime = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + 1,
    9,
    0,
    0,
  ).toISOString();
  await db()
    .collection('users')
    .doc(user.uid)
    .set({
      uid: user.uid,
      email: user.email,
      workoutReminders: true,
      workoutReminderTime: reminderTime,
      testReminderTime: reminderTime,
      testReminders: true,
      syncPlanWithCalendar: false,
      autoPlay: true,
      prepTime: 15,
      workoutMusic: true,
      goalReminders: true,
      ...extraData,
    });
  if (!user.emailVerified) {
    await user.sendEmailVerification();
  }
  return user;
};

const getExercisesQuery = async (
  level: Level,
  goal: Goal,
  warmUp: WarmUp[],
  coolDown: CoolDown[],
) => {
  let warmUpDocs: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[] =
    [];
  let coolDownDocs: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[] =
    [];
  if (warmUp.length) {
    const warmUpQuery =
      warmUp.length > 10
        ? await db().collection('exercises').get()
        : await db()
            .collection('exercises')
            .where('warmUp', 'in', warmUp)
            .get();
    warmUpDocs = warmUpQuery.docs.filter(doc =>
      warmUp.includes(doc.data().warmUp),
    );
  }
  if (coolDown.length) {
    const coolDownQuery =
      coolDown.length > 10
        ? await db().collection('exercises').get()
        : await db()
            .collection('exercises')
            .where('coolDown', 'in', coolDown)
            .get();
    coolDownDocs = coolDownQuery.docs.filter(doc =>
      coolDown.includes(doc.data().coolDown),
    );
  }
  const exercises = await db()
    .collection('exercises')
    .where('type', '==', goal)
    .where('level', '==', level)
    .get();
  return [...exercises.docs, ...warmUpDocs, ...coolDownDocs];
};

export const getExercises = async (
  level: Level,
  goal: Goal,
  warmUp: WarmUp[],
  coolDown: CoolDown[],
) => {
  const docs = await getExercisesQuery(level, goal, warmUp, coolDown);
  return docs.reduce((acc: {[id: string]: Exercise}, cur) => {
    const exercise: any = cur.data();
    acc[cur.id] = {
      ...exercise,
      id: cur.id,
      createdate: exercise.createdate?.toDate(),
      lastupdate: exercise.lastupdate?.toDate(),
    };
    return acc;
  }, {});
};

export const getAllExercises = async () => {
  const snapshot = await db().collection('exercises').get();
  return snapshot.docs.reduce((acc: {[id: string]: Exercise}, cur) => {
    const exercise: any = cur.data();
    acc[cur.id] = {
      ...exercise,
      id: cur.id,
      createdate: exercise.createdate?.toDate(),
      lastupdate: exercise.lastupdate?.toDate(),
    };
    return acc;
  }, {});
};

export const getExercisesById = async (ids: string[]) => {
  if (!ids?.length) {
    return [];
  }
  const validIds = ids.filter(id => id);

  if (validIds.length > 10) {
    const snapshot = await db().collection('exercises').get();
    return snapshot.docs
      .filter(doc => validIds.includes(doc.id))
      .reduce((acc: {[id: string]: Exercise}, cur) => {
        const exercise: any = cur.data();
        acc[cur.id] = {
          ...exercise,
          id: cur.id,
          createdate: exercise.createdate?.toDate(),
          lastupdate: exercise.lastupdate?.toDate(),
        };
        return acc;
      }, {});
  } else {
    const snapshot = await db()
      .collection('exercises')
      .where(db.FieldPath.documentId(), 'in', validIds)
      .get();
    return snapshot.docs.reduce((acc: {[id: string]: Exercise}, cur) => {
      const exercise: any = cur.data();
      acc[cur.id] = {
        ...exercise,
        id: cur.id,
        createdate: exercise.createdate?.toDate(),
        lastupdate: exercise.lastupdate?.toDate(),
      };
      return acc;
    }, {});
  }
};

export const getTests = async () => {
  const snapshot = await db().collection('tests').get();
  return snapshot.docs.reduce((acc: {[id: string]: Test}, cur) => {
    const test: any = cur.data();
    acc[cur.id] = {
      ...test,
      id: cur.id,
      createdate: test.createdate?.toDate(),
      lastupdate: test.lastupdate?.toDate(),
    };
    return acc;
  }, {});
};

export const getTestsById = async (ids: string[]) => {
  if (!ids?.length) {
    return [];
  }
  const validIds = ids.filter(id => id);
  if (validIds.length > 10) {
    const snapshot = await db().collection('tests').get();
    return snapshot.docs
      .filter(doc => ids.includes(doc.id))
      .reduce((acc: {[id: string]: Test}, cur) => {
        const test: any = cur.data();
        acc[cur.id] = {
          ...test,
          id: cur.id,
          createdate: test.createdate?.toDate(),
          lastupdate: test.lastupdate?.toDate(),
        };
        return acc;
      }, {});
  } else {
    const snapshot = await db()
      .collection('tests')
      .where(db.FieldPath.documentId(), 'in', validIds)
      .get();
    return snapshot.docs.reduce((acc: {[id: string]: Test}, cur) => {
      const test: any = cur.data();
      acc[cur.id] = {
        ...test,
        id: cur.id,
        createdate: test.createdate?.toDate(),
        lastupdate: test.lastupdate?.toDate(),
      };
      return acc;
    }, {});
  }
};

export const getQuickRoutines = async () => {
  const snapshot = await db().collection('quickRoutines').get();
  return snapshot.docs.reduce((acc: {[id: string]: QuickRoutine}, cur) => {
    const quickRoutine: any = cur.data();
    acc[cur.id] = {
      ...quickRoutine,
      id: cur.id,
      createdate: quickRoutine.createdate?.toDate(),
      lastupdate: quickRoutine.lastupdate?.toDate(),
    };
    return acc;
  }, {});
};

export const getQuickRoutinesById = async (ids: string[]) => {
  if (!ids?.length) {
    return [];
  }
  const validIds = ids.filter(id => id);
  if (validIds.length > 10) {
    const snapshot = await db().collection('quickRoutines').get();
    return snapshot.docs
      .filter(doc => ids.includes(doc.id))
      .reduce((acc: {[id: string]: QuickRoutine}, cur) => {
        const quickRoutine: any = cur.data();
        acc[cur.id] = {
          ...quickRoutine,
          id: cur.id,
          createdate: quickRoutine.createdate?.toDate(),
          lastupdate: quickRoutine.lastupdate?.toDate(),
        };
        return acc;
      }, {});
  } else {
    const snapshot = await db()
      .collection('quickRoutines')
      .where(db.FieldPath.documentId(), 'in', validIds)
      .get();
    return snapshot.docs.reduce((acc: {[id: string]: QuickRoutine}, cur) => {
      const quickRoutine: any = cur.data();
      acc[cur.id] = {
        ...quickRoutine,
        id: cur.id,
        createdate: quickRoutine.createdate?.toDate(),
        lastupdate: quickRoutine.lastupdate?.toDate(),
      };
      return acc;
    }, {});
  }
};

export const saveWorkout = (workout: SavedWorkout, uid: string) => {
  return db()
    .collection('users')
    .doc(uid)
    .collection('savedWorkouts')
    .add(workout);
};

export const saveTest = (test: SavedTest, uid: string) => {
  return db().collection('users').doc(uid).collection('savedTests').add(test);
};

export const saveQuickRoutine = (
  quickRoutine: SavedQuickRoutine,
  uid: string,
) => {
  return db()
    .collection('users')
    .doc(uid)
    .collection('savedQuickRoutines')
    .add(quickRoutine);
};

export const getSavedWorkouts = async (uid: string) => {
  const savedWorkouts = await db()
    .collection('users')
    .doc(uid)
    .collection('savedWorkouts')
    .where('saved', '==', true)
    .orderBy('createdate')
    .limitToLast(20)
    .get();
  return savedWorkouts.docs.reduce((acc: {[id: string]: SavedWorkout}, cur) => {
    const workout: any = cur.data();
    acc[cur.id] = {
      ...workout,
      id: cur.id,
      createdate: workout.createdate.toDate(),
    };
    return acc;
  }, {});
};

export const getSavedTests = async (uid: string) => {
  const savedTests = await db()
    .collection('users')
    .doc(uid)
    .collection('savedTests')
    .where('saved', '==', true)
    .orderBy('createdate')
    .limitToLast(20)
    .get();
  return savedTests.docs.reduce((acc: {[id: string]: SavedTest}, cur) => {
    const test: any = cur.data();
    acc[cur.id] = {...test, id: cur.id, createdate: test.createdate.toDate()};
    return acc;
  }, {});
};

export const getSavedQuickRoutines = async (uid: string) => {
  const savedQuickRoutines = await db()
    .collection('users')
    .doc(uid)
    .collection('savedQuickRoutines')
    .where('saved', '==', true)
    .orderBy('createdate')
    .limitToLast(20)
    .get();
  return savedQuickRoutines.docs.reduce(
    (acc: {[id: string]: SavedQuickRoutine}, cur) => {
      const routine: any = cur.data();
      acc[cur.id] = {
        ...routine,
        id: cur.id,
        createdate: routine.createdate.toDate(),
      };
      return acc;
    },
    {},
  );
};

export const getWeeklyItems = async (uid: string): Promise<WeeklyItems> => {
  try {
    const response = await functions().httpsCallable('getWeeklyItems')({uid});
    const {quickRoutines, tests, workouts} = response.data;
    return {quickRoutines, tests, workouts};
  } catch (e) {
    Snackbar.show({text: 'Error fetching weekly items'});
    return {quickRoutines: {}, tests: {}, workouts: {}};
  }
};

export const getEducation = async () => {
  const education = await db().collection('education').get();
  return education.docs.reduce((acc: {[id: string]: Education}, cur) => {
    const edu: any = cur.data();
    acc[cur.id] = {...edu, id: cur.id, createdate: edu.createdate.toDate()};
    return acc;
  }, {});
};

export const getEducationById = async (ids: string[]) => {
  if (!ids?.length) {
    return [];
  }
  const validIds = ids.filter(id => id);
  if (validIds.length > 10) {
    const snapshot = await db().collection('education').get();
    return snapshot.docs
      .filter(doc => ids.includes(doc.id))
      .reduce((acc: {[id: string]: Education}, cur) => {
        const test: any = cur.data();
        acc[cur.id] = {
          ...test,
          id: cur.id,
          createdate: test.createdate.toDate(),
        };
        return acc;
      }, {});
  } else {
    const snapshot = await db()
      .collection('education')
      .where(db.FieldPath.documentId(), 'in', validIds)
      .get();
    return snapshot.docs.reduce((acc: {[id: string]: Education}, cur) => {
      const test: any = cur.data();
      acc[cur.id] = {...test, id: cur.id, createdate: test.createdate.toDate()};
      return acc;
    }, {});
  }
};

export const getRecipes = async () => {
  const recipes = await db().collection('recipes').get();
  return recipes.docs.reduce((acc: {[id: string]: Recipe}, cur) => {
    const recipe: any = cur.data();
    acc[cur.id] = {
      ...recipe,
      id: cur.id,
      createdate: recipe.createdate.toDate(),
    };
    return acc;
  }, {});
};

export const getRecipesById = async (ids: string[]) => {
  if (!ids?.length) {
    return [];
  }
  const validIds = ids.filter(id => id);
  if (validIds.length > 10) {
    const snapshot = await db().collection('recipes').get();
    return snapshot.docs
      .filter(doc => ids.includes(doc.id))
      .reduce((acc: {[id: string]: Recipe}, cur) => {
        const recipe: any = cur.data();
        acc[cur.id] = {
          ...recipe,
          id: cur.id,
          createdate: recipe.createdate.toDate(),
        };
        return acc;
      }, {});
  } else {
    const snapshot = await db()
      .collection('recipes')
      .where(db.FieldPath.documentId(), 'in', validIds)
      .get();
    return snapshot.docs.reduce((acc: {[id: string]: Recipe}, cur) => {
      const recipe: any = cur.data();
      acc[cur.id] = {
        ...recipe,
        id: cur.id,
        createdate: recipe.createdate.toDate(),
      };
      return acc;
    }, {});
  }
};

export const generateLink = async () => {
  try {
    const response = await functions().httpsCallable('generateLink')();
    return response.data.link;
  } catch (e) {
    Snackbar.show({text: 'Error generating link'});
  }
};

export const acceptInviteLink = async (value: string) => {
  const response = await functions().httpsCallable('acceptInviteLink')({
    value,
  });
  return response.data.user;
};

export const setFCMToken = (uid: string, FCMToken: string) => {
  return db().collection('users').doc(uid).update({FCMToken});
};

export const getConnections = async (uid: string) => {
  // const response = await functions().httpsCallable('getConnections')();
  // return response.data.users;
  const connections = await db()
    .collection('users')
    .doc(uid)
    .collection('connections')
    .get();
  const uids = connections.docs.map(doc => doc.data().uid);
  if (uids.length) {
    const users: {[uid: string]: Profile} = {};
    const uidArrays = chunkArrayInGroups(uids, 10);
    for (let i = 0; i < uidArrays.length; i++) {
      const arr = uidArrays[i];
      const userData = await db()
        .collection('users')
        .where(db.FieldPath.documentId(), 'in', arr)
        .get();
      userData.docs.forEach(doc => {
        const user: any = doc.data();
        users[doc.id] = user;
      });
    }

    return users;
  }
  return {};
};

export const getChats = async (uid: string) => {
  const idQuery = await db()
    .collection('users')
    .doc(uid)
    .collection('chats')
    .get();
  const ids = idQuery.docs.map(chat => chat.data().id);
  if (ids.length) {
    const idArrays = chunkArrayInGroups(ids, 10);
    const chats: {[key: string]: Chat} = {};
    for (let i = 0; i < idArrays.length; i++) {
      const arr = idArrays[i];
      const chatsData = await db()
        .collection('chats')
        .where(db.FieldPath.documentId(), 'in', arr)
        .get();
      chatsData.docs.forEach(doc => {
        const otherUid = doc.data().users.find((id: string) => id !== uid);
        const chat: any = {id: doc.id, ...doc.data()};
        chats[otherUid] = chat;
      }, {});
    }

    return chats;
  }
  return {};
};

export const getMessages = async (chatId: string, startAfter: number) => {
  const query = await db()
    .collection('chats')
    .doc(chatId)
    .collection('messages')
    .orderBy('createdAt')
    .where('createdAt', '<', startAfter)
    .limitToLast(20)
    .get();
  return query.docs.reduce((acc: {[id: string]: Message}, cur) => {
    const message: any = cur.data();
    acc[message ? message._id : cur.id] = {...message, id: cur.id};
    return acc;
  }, {});
};

export const sendMessage = (
  message: Message,
  chatId: string,
  userId: string,
) => {
  return functions().httpsCallable('sendMessage')({message, chatId, userId});
};

export const deleteMessage = (
  message: Message,
  chatId: string,
  messageId: string,
) => {
  return functions().httpsCallable('deleteMessage')({
    message,
    chatId,
    messageId,
  });
};

export const setUnread = (uid: string, unread: {[key: string]: number}) => {
  return db().collection('users').doc(uid).update({unread});
};

export const getSettings = async () => {
  const snapshot = await db().collection('settings').get();
  return snapshot.docs[0].data();
};

export const sendFeedback = async (
  uid: string,
  feedback: string,
  rating: number,
) => {
  return db()
    .collection('feedback')
    .doc(uid)
    .set({feedback, rating, createdate: new Date()});
};
