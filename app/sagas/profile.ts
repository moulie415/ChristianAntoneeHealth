import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
// import Shake from '@shakebugs/react-native-shake';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';
import PushNotification from 'react-native-push-notification';
import {eventChannel} from '@redux-saga/core';
import {EventChannel} from '@redux-saga/core';
import RNFetchBlob, {FetchBlobResponse} from 'rn-fetch-blob';
import analytics from '@react-native-firebase/analytics';
import moment from 'moment';
import {
  take,
  call,
  select,
  put,
  all,
  takeEvery,
  takeLatest,
  fork,
  debounce,
  throttle,
} from 'redux-saga/effects';
import {
  setLoggedIn,
  setProfile,
  SIGN_UP,
  SignUpAction,
  setMonthlyWeightSamples,
  GET_SAMPLES,
  setMonthlyStepSamples,
  setWeeklySteps,
  UPDATE_PROFILE,
  UpdateProfileAction,
  SET_WORKOUT_REMINDERS,
  SetWorkoutRemindersAction,
  SET_WORKOUT_REMINDER_TIME,
  SetWorkoutReminderTimeAction,
  setWorkoutReminderTime,
  SET_MONTHLY_TEST_REMINDERS,
  SetMonthlyTestRemindersAction,
  setMonthlyTestReminders,
  setStep,
  HandleAuthAction,
  HANDLE_AUTH,
  handleAuth,
  setPremium,
  setAdmin,
  GET_CONNECTIONS,
  setConnections,
  setLoading,
  setChats,
  SEND_MESSAGE,
  SendMessageAction,
  setMessage,
  SET_READ,
  SetReadAction,
  setUnread,
  SET_CHATS,
  SetChatsAction,
  setMessages,
} from '../actions/profile';
import {getTests} from '../actions/tests';
import {getProfileImage} from '../helpers/images';
import Profile from '../types/Profile';
import {MyRootState, Sample, StepSample} from '../types/Shared';
import * as api from '../helpers/api';
import {
  goBack,
  navigate,
  navigateToLoginIfNecessary,
  navigationRef,
  resetToTabs,
} from '../RootNavigation';
import {Alert, Platform} from 'react-native';
import {
  getActivitySamples,
  getStepSamples,
  getWeeklySteps,
  getWeightSamples,
  initBiometrics,
  isAvailable,
  isEnabled,
  saveHeight,
  saveWeight,
} from '../helpers/biometrics';
import Snackbar from 'react-native-snackbar';
import {HealthValue} from 'react-native-health';
import {ActivitySampleResponse} from 'react-native-google-fit';
import {scheduleLocalNotification} from '../helpers';
import {
  DownloadVideoAction,
  DOWNLOAD_VIDEO,
  setVideo,
  setVideoLoading,
} from '../actions/exercises';
import Exercise from '../types/Exercise';
import Purchases, {PurchaserInfo} from 'react-native-purchases';
import {setUserAttributes} from '../helpers/profile';
import {handleDeepLink} from './exercises';
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import messaging from '@react-native-firebase/messaging';
import Chat from '../types/Chat';
import db from '@react-native-firebase/firestore';
import Sound from 'react-native-sound';
import {getSettings} from './settings';
import {SettingsState} from '../reducers/settings';
import {logError} from '../helpers/error';

const notif = new Sound('notif.wav', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
  }
});

type Snapshot = FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>;

function* getSamplesWorker() {
  const month = moment().month();

  const weeklySteps: StepSample[] = yield call(getWeeklySteps);
  if (Platform.OS === 'ios') {
    const aggregatedWeeklySteps = Object.values(
      weeklySteps.reduce(
        (acc: {[key: string]: {date: string; value: number}}, cur) => {
          const date = moment(cur.date).format('YYYY-MM-DD');
          if (acc[date]) {
            acc[date] = {date, value: acc[date].value + cur.value};
          } else {
            acc[date] = {date, value: cur.value};
          }
          return acc;
        },
        {},
      ),
    );
    yield put(setWeeklySteps(aggregatedWeeklySteps));
  } else {
    yield put(setWeeklySteps(weeklySteps));
  }

  const stepSamples: StepSample[] = yield call(getStepSamples);
  yield put(setMonthlyStepSamples(stepSamples, month));

  const {unit} = yield select((state: MyRootState) => state.profile.profile);
  const weightSamples: Sample[] = yield call(getWeightSamples, unit);
  yield put(setMonthlyWeightSamples(weightSamples, month));

  const activitySamples: HealthValue[] | ActivitySampleResponse[] = yield call(
    getActivitySamples,
  );

  if (activitySamples) {
  }
}

function onAuthStateChanged() {
  return eventChannel(emitter => {
    const subscriber = auth().onAuthStateChanged(user => {
      emitter({user});
    });
    return subscriber;
  });
}

function* updateProfile(action: UpdateProfileAction) {
  const {
    weight,
    height,
    unit,
    dob,
    goals,
    gender,
    workoutFrequency,
    purpose,
    avatar,
  } = action.payload;
  try {
    const enabled: boolean = yield call(isEnabled);
    if (enabled && weight && height && unit) {
      yield call(saveWeight, weight, unit);
      yield call(saveHeight, height, unit);
    }
  } catch (e) {
    console.log(e);
  }
  const {profile} = yield select((state: MyRootState) => state.profile);
  const updateObj = {
    ...profile,
    ...(dob ? {dob} : {}),
    ...(weight ? {weight} : {}),
    ...(height ? {height} : {}),
    ...(unit ? {unit} : {}),
    ...(gender ? {gender} : {}),
    ...(goals ? {goals} : {}),
    ...(workoutFrequency ? {workoutFrequency} : {}),
    ...(purpose ? {purpose} : {}),
    ...(avatar ? {avatar} : {}),
  };
  yield call(api.updateUser, updateObj);
  yield put(setProfile(updateObj));
  yield call(Snackbar.show, {text: 'Profile updated'});
  setUserAttributes({
    birthday: dob,
    weight: weight?.toString(),
    height: height?.toString(),
    unit,
    gender,
    goals: goals?.toString(),
    workoutFrequency: workoutFrequency?.toString(),
    purpose,
  });
}

function* downloadVideoWorker(action: DownloadVideoAction) {
  const id = action.payload;
  const {exercises, videos} = yield select(
    (state: MyRootState) => state.exercises,
  );
  const exercise: Exercise = exercises[id];
  const video: {src: string; path: string} | undefined = videos[id];
  if (exercise.video) {
    try {
      let exists = true;
      if (video && video.path && Platform.OS === 'ios') {
        exists = yield call(RNFetchBlob.fs.exists, video.path);
      }
      if (!exists && video) {
        const {uid} = yield select(
          (state: MyRootState) => state.profile.profile,
        );
        analytics().logEvent('redownload_video', {os: Platform.OS, uid});
      }
      if (!video || video.src !== exercise.video.src || !exists) {
        yield put(setVideoLoading(true));
        const response: FetchBlobResponse = yield call(
          RNFetchBlob.config({
            fileCache: true,
            appendExt: 'mp4',
          }).fetch,
          'GET',
          exercise.video.src,
        );
        yield put(setVideo(id, exercise.video.src, response.path()));
      }
    } catch (e) {
      yield call(Alert.alert, 'Error', `Error downloading video: ${e.message}`);
    }
  } else {
    yield call(
      Alert.alert,
      'Sorry',
      'Video has not yet been uploaded for this exercise',
    );
  }
  yield put(setVideoLoading(false));
}

function* signUp(action: SignUpAction) {
  const {
    dry,
    name,
    dob,
    weight,
    unit,
    height,
    gender,
    goals,
    workoutFrequency,
    purpose,
    password,
    email,
  } = action.payload;
  try {
    try {
      const enabled: boolean = yield call(isEnabled);
      if (enabled) {
        yield call(saveWeight, weight, unit);
        yield call(saveHeight, height, unit);
      }
    } catch (e) {
      console.log(e);
    }
    if (dry) {
      yield call(api.createUser, email, password, {
        signedUp: true,
        name,
        dob,
        weight,
        height,
        unit,
        gender,
        goals,
        workoutFrequency,
        purpose,
      });
      goBack();
      navigate('Login');
    } else {
      const {profile} = yield select((state: MyRootState) => state.profile);
      yield call(api.updateUser, {
        ...profile,
        signedUp: true,
        name,
        dob,
        weight,
        unit,
        height,
        gender,
        goals,
        workoutFrequency,
        purpose,
      });
      yield put(
        setProfile({
          ...profile,
          name,
          dob,
          weight,
          height,
          unit,
          gender,
          goals,
          workoutFrequency,
          purpose,
        }),
      );
      resetToTabs();
      navigate('Premium');
    }
    setUserAttributes({
      name,
      birthday: dob,
      weight: weight?.toString(),
      height: height?.toString(),
      unit,
      gender,
      goals: goals.toString(),
      workoutFrequency: workoutFrequency.toString(),
      purpose,
    });
  } catch (e) {
    Alert.alert('Error', e.nativeErrorMessage || e.message);
  }
  yield put(setStep(0));
  yield fork(getWorkoutReminders);
}

const WORKOUT_REMINDERS_ID = '1';
const MONTHLY_TEST_REMINDERS_ID = '2';
export const WORKOUT_REMINDERS_CHANNEL_ID = 'WORKOUT_REMINDER_CHANNEL_ID';
export const MONTHLY_TEST_REMINDERS_CHANNEL_ID =
  'MONTHLY_TEST_REMINDERS_CHANNEL_ID';
export const CONNECTION_ID = 'CONNECTION_ID';
export const MESSAGE_CHANNEL_ID = 'MESSAGE_CHANNEL_ID';

function* getWorkoutReminders() {
  const {workoutReminderTime, monthlyTestReminders} = yield select(
    (state: MyRootState) => state.profile,
  );
  yield put(setWorkoutReminderTime(new Date(workoutReminderTime)));
  yield put(setMonthlyTestReminders(monthlyTestReminders));
}

const channels: {
  channelId: string;
  channelName: string;
  channelDescription: string;
}[] = [
  {
    channelId: WORKOUT_REMINDERS_CHANNEL_ID,
    channelName: 'Workout reminders',
    channelDescription: 'Daily reminders to workout',
  },
  {
    channelId: MONTHLY_TEST_REMINDERS_CHANNEL_ID,
    channelName: 'Monthly reminders',
    channelDescription: 'Monthly reminders to take a fitness test',
  },
  {
    channelId: CONNECTION_ID,
    channelName: 'Connections',
    channelDescription: 'Channel for in app connections',
  },
  {
    channelId: MESSAGE_CHANNEL_ID,
    channelName: 'Messages',
    channelDescription: 'Channel for receiving messages from connections',
  },
];

function* createChannels() {
  channels.forEach(({channelId, channelName, channelDescription}) => {
    PushNotification.createChannel(
      {
        channelId,
        channelName,
        channelDescription,
      },
      created => console.log('channel created', created),
    );
  });
}

function* setWorkoutRemindersWorker(action: SetWorkoutRemindersAction) {
  const enabled = action.payload;
  const {workoutReminderTime} = yield select(
    (state: MyRootState) => state.profile,
  );

  if (enabled) {
    scheduleLocalNotification(
      'Reminder to workout',
      workoutReminderTime,
      WORKOUT_REMINDERS_ID,
      WORKOUT_REMINDERS_CHANNEL_ID,
    );
  } else {
    PushNotification.cancelLocalNotification(`${WORKOUT_REMINDERS_ID}`);
  }
}

function* setWorkoutReminderTimeWorker(action: SetWorkoutReminderTimeAction) {
  const time = action.payload;
  const {workoutReminders} = yield select(
    (state: MyRootState) => state.profile,
  );

  if (workoutReminders) {
    scheduleLocalNotification(
      'Reminder to workout',
      time,
      WORKOUT_REMINDERS_ID,
      WORKOUT_REMINDERS_CHANNEL_ID,
    );
  }
}

function* setMonthlyTestRemindersWorker(action: SetMonthlyTestRemindersAction) {
  const {monthlyTestReminderTime} = yield select(
    (state: MyRootState) => state.profile,
  );
  const enabled = action.payload;
  if (enabled) {
    scheduleLocalNotification(
      'Monthly fitness test reminder',
      new Date(monthlyTestReminderTime),
      MONTHLY_TEST_REMINDERS_ID,
      MONTHLY_TEST_REMINDERS_CHANNEL_ID,
      'month',
    );
  } else {
    PushNotification.cancelLocalNotification(`${MONTHLY_TEST_REMINDERS_ID}`);
  }
}

function* getConnections() {
  try {
    const {uid} = yield select((state: MyRootState) => state.profile.profile);
    yield put(setLoading(true));
    const connections: {[key: string]: Profile} = yield call(
      api.getConnections,
      uid,
    );
    const chats: {[key: string]: Chat} = yield call(api.getChats, uid);
    yield put(setChats(chats));
    yield put(setConnections(connections));
    yield put(setLoading(false));
  } catch (e) {
    Snackbar.show({text: 'Error fetching connections'});
    console.warn(e.message);
    yield put(setLoading(false));
  }
}

function onChatMessage(id: string) {
  return eventChannel(emitter => {
    const subscriber = db()
      .collection('chats')
      .doc(id)
      .collection('messages')
      .limitToLast(20)
      .orderBy('createdAt')
      .onSnapshot(
        snapshot => {
          emitter(snapshot);
        },
        error => {
          console.warn(error);
        },
      );
    return subscriber;
  });
}

function* chatWatcher(uid: string, chatsObj: {[key: string]: Chat}) {
  const channel: EventChannel<Snapshot> = yield call(
    onChatMessage,
    chatsObj[uid].id,
  );
  while (true) {
    const snapshot: Snapshot = yield take(channel);
    yield put(setMessages(uid, snapshot));
    if (navigationRef.current) {
      const route: any = navigationRef.current.getCurrentRoute();
      const {state} = yield select((state: MyRootState) => state.profile);
      if (
        route.name === 'Chat' &&
        route.params?.uid === uid &&
        state === 'active'
      ) {
        notif.play();
      }
    }
  }
}

function* chatsWatcher(action: SetChatsAction) {
  const chatsObj = action.payload;
  const uids = Object.keys(chatsObj);
  for (const uid of uids) {
    yield fork(chatWatcher, uid, chatsObj);
  }
}

function* sendMessage(action: SendMessageAction) {
  const {chatId, message, uid} = action.payload;
  try {
    yield put(setMessage(uid, message));
    yield call(api.sendMessage, message, chatId, uid);
    notif.play();
  } catch (e) {
    Snackbar.show({text: e.message});
    yield put(setMessage(uid, {...message, sent: false, pending: false}));
  }
}

function* setRead(action: SetReadAction) {
  const otherUid = action.payload;
  const {uid} = yield select((state: MyRootState) => state.profile.profile);
  const current: {[key: string]: number} = yield select(
    (state: MyRootState) => state.profile.profile.unread,
  );
  if (current) {
    const unread = {...current, [otherUid]: 0};
    yield call(api.setUnread, uid, unread);
    yield put(setUnread(unread));
  }
}

function* handleAuthWorker(action: HandleAuthAction) {
  const user = action.payload;
  try {
    if (user && user.emailVerified) {
      // Shake.setMetadata('uid', user.uid);
      const doc: FirebaseFirestoreTypes.DocumentSnapshot = yield call(
        api.getUser,
        user,
      );

      if (doc.exists) {
        yield put(setProfile(doc.data() as Profile));
      } else {
        const avatar = getProfileImage(user);
        const userObj = {
          uid: user.uid,
          email: user.email,
          avatar,
          name: user.displayName,
          providerId: user.providerData[0].providerId,
        };
        yield put(setProfile(userObj));
        yield call(api.setUser, userObj);
      }
      const {purchaserInfo, created} = yield call(Purchases.logIn, user.uid);
      crashlytics().setUserId(user.uid);
      yield call(getSettings);
      const settings: SettingsState = yield select(
        (state: MyRootState) => state.settings,
      );
      const isAdmin = settings.admins.includes(user.uid);
      yield put(setAdmin(isAdmin));
      if (purchaserInfo.entitlements.active.Premium || isAdmin) {
        yield put(setPremium(true));
      } else {
        yield put(setPremium(false));
      }

      setUserAttributes({
        email: user.email,
        emailVerified: String(user.emailVerified),
        providerId: user.providerData[0].providerId,
        premium: purchaserInfo.entitlements.active.Premium ? 'true' : 'false',
      });
      if (doc.exists && doc.data().signedUp) {
        const available: boolean = yield call(isAvailable);
        if (available) {
          yield call(initBiometrics);
        }
        resetToTabs();
        const getLinkPromise = () => {
          return new Promise<FirebaseDynamicLinksTypes.DynamicLink>(resolve => {
            dynamicLinks()
              .getInitialLink()
              .then(link => {
                resolve(link);
              });
          });
        };
        const link: FirebaseDynamicLinksTypes.DynamicLink = yield call(
          getLinkPromise,
        );

        if (link && link.url) {
          yield call(handleDeepLink, link.url);
        }

        messaging()
          .requestPermission()
          .then(async authStatus => {
            const enabled =
              authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
              authStatus === messaging.AuthorizationStatus.PROVISIONAL;
            if (enabled) {
              const FCMToken = await messaging().getToken();
              api.setFCMToken(user.uid, FCMToken);
            }
          });
        const {premium} = yield select(
          (state: MyRootState) => state.profile.profile,
        );
        if (doc.data().unread && premium) {
          yield put(setUnread(doc.data().unread));
        }
      } else {
        navigate('SignUpFlow');
        yield put(setStep(0));
      }
      yield put(setLoggedIn(true));
      yield put(getTests());
      yield fork(createChannels);
    } else if (user) {
      Alert.alert(
        'Account not verified',
        'Please verify your account using the link we sent to your email address, please also check your spam folder',
      );
      navigateToLoginIfNecessary();
    } else {
      yield put(setLoggedIn(false));
      navigate('Login');
    }
  } catch (e) {
    navigate('Login');
    logError(e);
    Alert.alert('Error', e.message);
  }
}

export default function* profileSaga() {
  yield all([
    takeLatest(SIGN_UP, signUp),
    takeLatest(GET_SAMPLES, getSamplesWorker),
    takeLatest(UPDATE_PROFILE, updateProfile),
    takeLatest(SET_WORKOUT_REMINDERS, setWorkoutRemindersWorker),
    takeLatest(SET_WORKOUT_REMINDER_TIME, setWorkoutReminderTimeWorker),
    takeLatest(SET_MONTHLY_TEST_REMINDERS, setMonthlyTestRemindersWorker),
    debounce(500, HANDLE_AUTH, handleAuthWorker),
    takeLatest(DOWNLOAD_VIDEO, downloadVideoWorker),
    throttle(30000, GET_CONNECTIONS, getConnections),
    takeLatest(SEND_MESSAGE, sendMessage),
    takeLatest(SET_READ, setRead),
    takeLatest(SET_CHATS, chatsWatcher),
  ]);

  const channel: EventChannel<{user: FirebaseAuthTypes.User}> = yield call(
    onAuthStateChanged,
  );
  while (true) {
    const {user}: {user: FirebaseAuthTypes.User} = yield take(channel);
    yield put(handleAuth(user));
  }
}
