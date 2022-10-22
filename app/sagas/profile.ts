import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
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
  setWorkoutReminderTime,
  setTestReminders,
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
  LOAD_EARLIER_MESSAGES,
  LoadEarlierMessagesAction,
  setMessagesObj,
  GET_WEEKLY_ITEMS,
  setWeeklyItems,
  REQUEST_PLAN,
  setPlanStatus,
  setMonthlyHeightSamples,
  SET_PREMIUM,
  SetPremiumAction,
} from '../actions/profile';
import {getTests} from '../actions/tests';
import {getProfileImage} from '../helpers/images';
import Profile, {PlanStatus} from '../types/Profile';
import {MyRootState, Sample, StepSample} from '../types/Shared';
import * as api from '../helpers/api';
import {goBack, navigate, navigationRef, resetToTabs} from '../RootNavigation';
import {Alert, Platform} from 'react-native';
import {
  getActivitySamples,
  getHeightSamples,
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
import {
  DownloadVideoAction,
  DOWNLOAD_VIDEO,
  setVideo,
  setVideoLoading,
} from '../actions/exercises';
import Exercise from '../types/Exercise';
import Purchases, {PurchasesOfferings} from 'react-native-purchases';
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
import Message from '../types/Message';
import {WeeklyItems} from '../reducers/profile';
import {getQuickRoutinesById} from '../actions/quickRoutines';
import {setUsedFreePlan} from '../actions/plan';

const notif = new Sound('notif.wav', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
  }
});

type Snapshot =
  FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>;

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

  const heightSamples: Sample[] = yield call(getHeightSamples, unit);
  yield put(setMonthlyHeightSamples(heightSamples, month));

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
    gender,
    equipment,
    experience,
    marketing,
    goal,
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
    ...(experience ? {experience} : {}),
    ...(marketing ? {marketing} : {}),
    ...(equipment ? {equipment} : {}),
    ...(goal ? {goal} : {}),
    ...(avatar ? {avatar} : {}),
  };
  yield call(api.updateUser, updateObj, profile.uid);
  yield put(setProfile(updateObj));
  yield call(Snackbar.show, {text: 'Profile updated'});
  setUserAttributes({
    birthday: dob,
    weight: weight?.toString(),
    height: height?.toString(),
    marketing: marketing?.toString(),
    unit,
    gender,
    equipment,
    experience,
    goal,
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
    name,
    surname,
    dob,
    weight,
    unit,
    height,
    gender,
    equipment,
    experience,
    goal,
    marketing,
    nutrition,
    trainingAvailability,
    injuries,
    occupation,
    stressLevel,
    sleepPattern,
    lifestyle,
    medications,
    fromProfile,
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

    const {profile} = yield select((state: MyRootState) => state.profile);
    yield call(
      api.updateUser,
      {
        ...profile,
        signedUp: true,
        name,
        surname,
        dob,
        weight,
        unit,
        height,
        gender,
        experience,
        equipment,
        marketing,
        goal,
        nutrition,
        trainingAvailability,
        injuries,
        occupation,
        stressLevel,
        sleepPattern,
        lifestyle,
        medications,
        planStatus: PlanStatus.UNINITIALIZED,
        signUpDate: moment().unix(),
      },
      profile.uid,
    );
    yield put(
      setProfile({
        ...profile,
        name,
        surname,
        dob,
        weight,
        height,
        unit,
        gender,
        experience,
        equipment,
        marketing,
        goal,
        nutrition,
        trainingAvailability,
        injuries,
        occupation,
        stressLevel,
        sleepPattern,
        lifestyle,
        medications,
        planStatus: PlanStatus.UNINITIALIZED,
      }),
    );
    if (fromProfile) {
      goBack();
    } else {
      resetToTabs();
    }

    setUserAttributes({
      name,
      surname,
      birthday: dob,
      weight: weight?.toString(),
      height: height?.toString(),
      unit,
      gender,
      experience,
      equipment,
      marketing: marketing?.toString(),
      goal,
      nutrition: nutrition.toString(),
      trainingAvailability: trainingAvailability.toString(),
      injuries,
      occupation,
      stressLevel,
      sleepPattern: sleepPattern.toString(),
      lifestyle,
      medications,
    });
  } catch (e) {
    Alert.alert('Error', e.nativeErrorMessage || e.message);
  }
}

const WORKOUT_REMINDERS_ID = '1';
const TEST_REMINDERS_ID = '2';
export const WORKOUT_REMINDERS_CHANNEL_ID = 'WORKOUT_REMINDER_CHANNEL_ID';
export const TEST_REMINDERS_CHANNEL_ID = 'TEST_REMINDERS_CHANNEL_ID';
export const CONNECTION_ID = 'CONNECTION_ID';
export const MESSAGE_CHANNEL_ID = 'MESSAGE_CHANNEL_ID';
export const PLAN_CHANNEL_ID = 'PLAN_CHANNEL_ID';

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
    channelId: TEST_REMINDERS_CHANNEL_ID,
    channelName: 'Test reminders',
    channelDescription: 'Reminders to take a fitness test',
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
  {
    channelId: PLAN_CHANNEL_ID,
    channelName: 'Plan updates',
    channelDescription: 'Channel for get notified about your plan updates',
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

function* getWeeklyItems() {
  try {
    yield put(setLoading(true));
    const {uid} = yield select((state: MyRootState) => state.profile.profile);
    const weeklyItems: WeeklyItems = yield call(api.getWeeklyItems, uid);
    const {quickRoutines} = yield select(
      (state: MyRootState) => state.quickRoutines,
    );
    const missingRoutines = Object.values(weeklyItems.quickRoutines)
      .filter(item => !quickRoutines[item.quickRoutineId])
      .map(routine => routine.quickRoutineId);
    yield put(getQuickRoutinesById(missingRoutines));
    yield put(setWeeklyItems(weeklyItems));
    yield put(setLoading(false));
  } catch (e) {
    yield put(setLoading(false));
    logError(e);
    Snackbar.show({text: 'Error fetching weekly data'});
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
    logError(e);
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
  try {
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
  } catch (e) {
    console.warn(e);
    logError(e);
  }
}

function* loadEarlierMessages(action: LoadEarlierMessagesAction) {
  try {
    const {chatId, uid, startAfter} = action.payload;
    const {messages} = yield select((state: MyRootState) => state.profile);
    const current = messages[uid];
    yield put(setLoading(true));
    const earlier: {[key: string]: Message} = yield call(
      api.getMessages,
      chatId,
      startAfter,
    );
    yield put(setMessagesObj(uid, {...current, ...earlier}));
    yield put(setLoading(false));
  } catch (e) {
    yield put(setLoading(false));
    Snackbar.show({text: 'Error loading earlier messages'});
    logError(e);
  }
}

function* requestPlanWorker() {
  try {
    yield put(setLoading(true));
    const {uid, usedFreePlan} = yield select(
      (state: MyRootState) => state.profile.profile,
    );
    if (!usedFreePlan) {
      yield call(api.requestPlan, uid);
      yield put(setPlanStatus(PlanStatus.PENDING));
      Snackbar.show({text: 'Your plan has been requested'});
      yield call(api.updateUser, {usedFreePlan: true}, uid);
      yield put(setUsedFreePlan(true));
    } else {
      const offerings: PurchasesOfferings = yield call(Purchases.getOfferings);
      const pkg = offerings.current.availablePackages.find(
        p => p.packageType === 'CUSTOM',
      );
      yield call(Purchases.purchasePackage, pkg);
      yield call(api.requestPlan, uid);
      yield put(setPlanStatus(PlanStatus.PENDING));
      Snackbar.show({text: 'Your plan has been requested'});
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(setLoading(false));
    logError(e);
    if (!e.userCancelled) {
      Snackbar.show({text: 'Error requesting plan'});
    }
  }
}

function* premiumUpdatedWorker() {
  while (true) {
    const oldPremium: boolean = yield select(
      (state: MyRootState) => state.profile.profile.premium,
    );
    yield take(SET_PREMIUM);
    const {premium, uid} = yield select(
      (state: MyRootState) => state.profile.profile,
    );
    if (oldPremium !== premium) {
      yield call(api.updateUser, {premium}, uid);
    }
  }
}

function* handleAuthWorker(action: HandleAuthAction) {
  const user = action.payload;
  try {
    if (
      user &&
      (user.emailVerified ||
        (user.providerData?.[0] &&
          user.providerData?.[0].providerId !== 'password'))
    ) {
      const doc: FirebaseFirestoreTypes.DocumentSnapshot = yield call(
        api.getUser,
        user.uid,
      );

      if (doc.exists) {
        yield put(setProfile(doc.data() as Profile));
      } else {
        const avatar = getProfileImage(user);
        const userObj = {
          uid: user.uid,
          email: user.email,
          avatar: avatar || '',
          name: user.displayName || '',
          providerId: user.providerData[0].providerId || '',
        };
        yield put(setProfile(userObj));
        yield call(api.setUser, userObj);
      }
      yield fork(premiumUpdatedWorker);
      const {customerInfo, created} = yield call(Purchases.logIn, user.uid);
      yield call(getSettings);
      const settings: SettingsState = yield select(
        (state: MyRootState) => state.settings,
      );
      const isAdmin = settings.admins.includes(user.uid);
      yield put(setAdmin(isAdmin));
      if (customerInfo.entitlements.active.Premium || isAdmin) {
        yield put(setPremium(true));
      } else {
        yield put(setPremium(false));
      }

      setUserAttributes({
        email: user.email,
        emailVerified: String(user.emailVerified),
        providerId: user.providerData[0].providerId,
        premium: customerInfo.entitlements.active.Premium ? 'true' : 'false',
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

        const {premium} = yield select(
          (state: MyRootState) => state.profile.profile,
        );
        if (doc.data().unread && premium) {
          yield put(setUnread(doc.data().unread));
        }
      } else {
        navigate('SignUpFlow');
      }
      yield put(setLoggedIn(true));
      yield put(getTests());
      yield fork(createChannels);
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
    } else if (user) {
      Alert.alert(
        'Account not verified',
        'Please verify your account using the link we sent to your email address, please also check your spam folder',
      );
      navigate('Login');
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
    debounce(3000, HANDLE_AUTH, handleAuthWorker),
    takeLatest(DOWNLOAD_VIDEO, downloadVideoWorker),
    debounce(1000, GET_CONNECTIONS, getConnections),
    takeLatest(SEND_MESSAGE, sendMessage),
    debounce(1000, SET_READ, setRead),
    takeLatest(SET_CHATS, chatsWatcher),
    takeLatest(LOAD_EARLIER_MESSAGES, loadEarlierMessages),
    takeLatest(GET_WEEKLY_ITEMS, getWeeklyItems),
    takeLatest(REQUEST_PLAN, requestPlanWorker),
    debounce(3000, SET_PREMIUM, premiumUpdatedWorker),
  ]);

  const channel: EventChannel<{user: FirebaseAuthTypes.User}> = yield call(
    onAuthStateChanged,
  );
  while (true) {
    const {user}: {user: FirebaseAuthTypes.User} = yield take(channel);
    yield put(handleAuth(user));
  }
}
