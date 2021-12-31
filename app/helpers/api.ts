import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import db from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import functions from '@react-native-firebase/functions';
import Exercise from '../types/Exercise';
import Profile from '../types/Profile';
import Test from '../types/Test';
import {CardioType, Goal, Level, StrengthArea} from '../types/Shared';
import QuickRoutine from '../types/QuickRoutines';
import {SavedQuickRoutine, SavedTest, SavedWorkout} from '../types/SavedItem';
import Education from '../types/Education';
import Snackbar from 'react-native-snackbar';

export const getUser = (user: FirebaseAuthTypes.User) => {
  return db().collection('users').doc(user.uid).get();
};

export const setUser = (user: Profile) => {
  return db().collection('users').doc(user.uid).set(user);
};

export const updateUser = (user: Profile) => {
  return db().collection('users').doc(user.uid).update(user);
};

export const createUser = async (
  email: string,
  password: string,
  extraData: object,
) => {
  const {user} = await auth().createUserWithEmailAndPassword(email, password);
  await db()
    .collection('users')
    .doc(user.uid)
    .set({uid: user.uid, email: user.email, ...extraData});
  if (!user.emailVerified) {
    await user.sendEmailVerification();
  }
};

const getExercisesQuery = (
  level: Level,
  goal: Goal,
  area: StrengthArea,
  cardioType: CardioType,
) => {
  if (goal === Goal.STRENGTH) {
    return db()
      .collection('exercises')
      .where('type', '==', goal)
      .where('area', '==', area)
      .where('level', '==', level)
      .get();
  }
  return db()
    .collection('exercises')
    .where('type', '==', goal)
    .where('cardioType', '==', cardioType)
    .where('level', '==', level)
    .get();
};

export const getExercises = async (
  level: Level,
  goal: Goal,
  area: StrengthArea,
  cardioType: CardioType,
) => {
  const snapshot = await getExercisesQuery(level, goal, area, cardioType);
  return snapshot.docs.reduce((acc: {[id: string]: Exercise}, cur) => {
    const exercise: any = cur.data();
    acc[cur.id] = {...exercise, id: cur.id};
    return acc;
  }, {});
};

export const getExercisesById = async (ids: string[]) => {
  const snapshot = await db()
    .collection('exercises')
    .where(db.FieldPath.documentId(), 'in', ids)
    .get();
  return snapshot.docs.reduce((acc: {[id: string]: Exercise}, cur) => {
    const exercise: any = cur.data();
    acc[cur.id] = {...exercise, id: cur.id};
    return acc;
  }, {});
};

export const deleteExercise = (id: string) => {
  return db().collection('exercises').doc(id).delete();
};

export const addExercise = (exercise: Exercise) => {
  return db().collection('exercises').add(exercise);
};

export const updateExercise = (exercise: Exercise) => {
  return db().collection('exercises').doc(exercise.id).update(exercise);
};

export const getTests = async () => {
  const snapshot = await db().collection('tests').get();
  return snapshot.docs.reduce((acc: {[id: string]: Test}, cur) => {
    const test: any = cur.data();
    acc[cur.id] = {...test, id: cur.id};
    return acc;
  }, {});
};

export const getTestsById = async (ids: string[]) => {
  const snapshot = await db()
    .collection('tests')
    .where(db.FieldPath.documentId(), 'in', ids)
    .get();
  return snapshot.docs.reduce((acc: {[id: string]: Test}, cur) => {
    const test: any = cur.data();
    acc[cur.id] = {...test, id: cur.id};
    return acc;
  }, {});
};

export const getQuickRoutines = async () => {
  const snapshot = await db().collection('quickRoutines').get();
  return snapshot.docs.reduce((acc: {[id: string]: QuickRoutine}, cur) => {
    const quickRoutine: any = cur.data();
    acc[cur.id] = {...quickRoutine, id: cur.id};
    return acc;
  }, {});
};

export const getQuickRoutinesById = async (ids: string[]) => {
  const snapshot = await db()
    .collection('quickRoutines')
    .where(db.FieldPath.documentId(), 'in', ids)
    .get();
  return snapshot.docs.reduce((acc: {[id: string]: QuickRoutine}, cur) => {
    const quickRoutine: any = cur.data();
    acc[cur.id] = {...quickRoutine, id: cur.id};
    return acc;
  }, {});
};

export const isAdmin = async (uid: string) => {
  const admins = await db().collection('admins').get();
  const keys = admins.docs.map(doc => doc.id);
  return keys.includes(uid);
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
    .limit(10)
    .get();
  return savedWorkouts.docs.reduce((acc: {[id: string]: SavedWorkout}, cur) => {
    const workout: any = cur.data();
    acc[cur.id] = {...workout, id: cur.id};
    return acc;
  }, {});
};

export const getSavedTests = async (uid: string) => {
  const savedTests = await db()
    .collection('users')
    .doc(uid)
    .collection('savedTests')
    .limit(10)
    .get();
  return savedTests.docs.reduce((acc: {[id: string]: SavedTest}, cur) => {
    const test: any = cur.data();
    acc[cur.id] = {...test, id: cur.id};
    return acc;
  }, {});
};

export const getSavedQuickRoutines = async (uid: string) => {
  const savedQuickRoutines = await db()
    .collection('users')
    .doc(uid)
    .collection('savedQuickRoutines')
    .limit(10)
    .get();
  return savedQuickRoutines.docs.reduce(
    (acc: {[id: string]: SavedQuickRoutine}, cur) => {
      const routine: any = cur.data();
      acc[cur.id] = {...routine, id: cur.id};
      return acc;
    },
    {},
  );
};

export const getEducation = async () => {
  const education = await db().collection('education').get();
  return education.docs.reduce((acc: {[id: string]: Education}, cur) => {
    const edu: any = cur.data();
    acc[cur.id] = {...edu, id: cur.id};
    return acc;
  }, {});
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
