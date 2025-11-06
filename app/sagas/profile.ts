import { NetInfoState, fetch } from '@react-native-community/netinfo';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import db, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import storage from '@react-native-firebase/storage';
import { statusCodes } from '@react-native-google-signin/google-signin';
import { EventChannel, eventChannel } from '@redux-saga/core';
import { PayloadAction } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react-native';
import * as Application from 'expo-application';
import { createAudioPlayer } from 'expo-audio';
import * as Device from 'expo-device';
import * as FileSystem from 'expo-file-system';
import * as Notifications from 'expo-notifications';
import _ from 'lodash';
import moment from 'moment';
import {
  Alert,
  Linking,
  PermissionsAndroid,
  PixelRatio,
  Platform,
} from 'react-native';
import { Audio, Image, Video } from 'react-native-compressor';
import { openInbox } from 'react-native-email-link';
import { openHealthConnectSettings } from 'react-native-health-connect';
import Purchases from 'react-native-purchases';
import Snackbar from 'react-native-snackbar';
import { updateApplicationContext } from 'react-native-watch-connectivity';
import {
  all,
  call,
  debounce,
  delay,
  fork,
  put,
  select,
  take,
  takeLatest,
  throttle,
} from 'redux-saga/effects';
import { RootState, store } from '../App';
import {
  goBack,
  navigate,
  navigationRef,
  resetToTabs,
} from '../RootNavigation';
import * as api from '../helpers/api';
import {
  getBodyFatPercentageSamples,
  getHeightSamples,
  getWeightSamples,
  initBiometrics,
  isAvailable,
  saveBodyFatPercentage,
  saveHeight,
  saveWeight,
} from '../helpers/biometrics';
import { checkVersion } from '../helpers/checkVersion';
import { logError } from '../helpers/error';
import { getGoalsData } from '../helpers/goals';
import { PREMIUM_PLUS } from '../helpers/hasPremiumPlus';
import { setUserAttributes } from '../helpers/profile';
import { getLeaderboard } from '../reducers/leaderboards';
import {
  GET_CONNECTIONS,
  GET_SAMPLES,
  GET_WEEKLY_ITEMS,
  GET_WEEKLY_ITEMS_FOR_CONNECTION,
  HANDLE_AUTH,
  LOAD_EARLIER_MESSAGES,
  REQUEST_MESSAGE_DELETION,
  SEND_MESSAGE,
  SET_CHATS,
  SET_PREMIUM,
  SET_READ,
  SET_UNREAD,
  SIGN_UP,
  UPDATE_PROFILE,
  WeeklyItems,
  deleteMessage,
  handleAuth,
  setAdmin,
  setBodyFatPercentageSamples,
  setBoneMassSamples,
  setChats,
  setConnections,
  setHeightSamples,
  setLoading,
  setLoggedIn,
  setMessage,
  setMessages,
  setMessagesObj,
  setMetabolicAgeSamples,
  setMuscleMassSamples,
  setPremium,
  setProfile,
  setUnread,
  setVisceralFatSamples,
  setWeeklyItems,
  setWeeklyItemsForConnection,
  setWeightSamples,
  updateProfile as updateProfileAction,
} from '../reducers/profile';
import { getQuickRoutinesById } from '../reducers/quickRoutines';
import { SettingsState } from '../reducers/settings';
import Chat from '../types/Chat';
import Message from '../types/Message';
import {
  DeviceInfo,
  Profile,
  Sample,
  SignUpPayload,
  UpdateProfilePayload,
} from '../types/Shared';
import { checkWorkoutStreak, getAllExercises } from './exercises';
import { checkStepsCalories } from './leaderboards';
import { getQuickRoutines } from './quickRoutines';
import { getSettings } from './settings';

const audioSource = require('../audio/notif.wav');

const notif = createAudioPlayer(audioSource);

type Snapshot =
  FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>;

function* getSamplesWorker() {
  const { uid, premium, freeBiometrics } = yield select(
    (state: RootState) => state.profile.profile,
  );
  const weightSamples: Sample[] = yield call(getWeightSamples, uid);
  yield put(setWeightSamples(weightSamples));

  const heightSamples: Sample[] = yield call(getHeightSamples, uid);
  yield put(setHeightSamples(heightSamples));

  if (premium || freeBiometrics) {
    const bodyFatPercentageSamples: Sample[] = yield call(
      getBodyFatPercentageSamples,
      uid,
    );

    yield put(setBodyFatPercentageSamples(bodyFatPercentageSamples));
    const muscleMassSamples: Sample[] = yield call(
      api.getSamples,
      'muscleMass',
      uid,
    );
    yield put(setMuscleMassSamples(muscleMassSamples));

    const boneMassSamples: Sample[] = yield call(
      api.getSamples,
      'boneMass',
      uid,
    );
    yield put(setBoneMassSamples(boneMassSamples));

    const visceralFatSamples: Sample[] = yield call(
      api.getSamples,
      'visceralFat',
      uid,
    );
    yield put(setVisceralFatSamples(visceralFatSamples));

    const metabolicAgeSamples: Sample[] = yield call(
      api.getSamples,
      'metabolicAge',
      uid,
    );
    yield put(setMetabolicAgeSamples(metabolicAgeSamples));
  }
}

function onAuthStateChanged() {
  return eventChannel(emitter => {
    const subscriber = auth().onAuthStateChanged(user => {
      emitter({ user });
    });
    return subscriber;
  });
}

function* updateProfile(action: PayloadAction<UpdateProfilePayload>) {
  const {
    weight,
    height,
    dob,
    gender,
    goal,
    avatar,
    bodyFatPercentage,
    muscleMass,
    boneMass,
    goalReminders,
    disableSnackbar,
  } = action.payload;
  yield put(setLoading(true));
  try {
    try {
      const { uid } = yield select((state: RootState) => state.profile.profile);
      if (weight) {
        yield call(saveWeight, uid, weight);
      }
      if (height) {
        yield call(saveHeight, uid, height);
      }
      if (bodyFatPercentage !== undefined) {
        yield call(saveBodyFatPercentage, bodyFatPercentage, uid);
      }
      if (muscleMass !== undefined) {
        yield call(api.saveSample, 'muscleMass', muscleMass, uid);
      }
      if (boneMass !== undefined) {
        yield call(api.saveSample, 'boneMass', boneMass, uid);
      }
    } catch (e) {
      Alert.alert(
        'Error saving body measurement',
        "Please make sure you've given CA Health sufficient permissions",
        [
          { text: 'Cancel' },
          {
            text: `Open ${
              Platform.OS === 'ios' ? 'Apple Health' : 'Health Connect'
            }`,
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('health://');
              } else {
                openHealthConnectSettings();
              }
            },
          },
        ],
      );

      logError(e);
    }
    const { profile }: { profile: Profile } = yield select(
      (state: RootState) => state.profile,
    );
    const updateObj: Profile = {
      ...profile,
      ...action.payload,
    };
    yield call(api.updateUser, updateObj, profile.uid);
    yield put(setProfile(updateObj));
    if (!disableSnackbar) {
      yield call(Snackbar.show, { text: 'Profile updated' });
    }
    setUserAttributes({
      birthday: dob || '',
      weight: weight?.toString() || '',
      height: height?.toString() || '',
      gender: gender || '',
      goal: goal || '',
      uid: profile.uid || '',
    });
    if (!goalReminders) {
      yield call(
        Notifications.cancelScheduledNotificationAsync,
        GOAL_REMINDER_KEY,
      );
    }

    yield put(setLoading(false));

    if (profile.premium && profile.optedInToLeaderboards) {
      const {
        weeklyCalories,
        weeklySteps,
        dailyCalories,
        dailySteps,
        dailyWorkoutStreak,
      } = action.payload;
      if (weeklySteps) {
        yield delay(3000);
        yield put(getLeaderboard('weeklySteps'));
      }
      if (dailySteps) {
        yield delay(3000);
        yield put(getLeaderboard('dailySteps'));
      }
      if (weeklyCalories) {
        yield delay(3000);
        yield put(getLeaderboard('weeklyCalories'));
      }

      if (dailyCalories) {
        yield delay(3000);
        yield put(getLeaderboard('dailyCalories'));
      }

      if (dailyWorkoutStreak) {
        yield delay(3000);
        yield put(getLeaderboard('workoutStreak'));
      }
    }
  } catch (e) {
    yield call(Snackbar.show, { text: 'Error updating profile' });
    logError(e);
  }
  yield put(setLoading(false));
}

function* signUp(action: PayloadAction<SignUpPayload>) {
  const { name, surname, dob, weight, height, gender, goal, fromProfile } =
    action.payload;
  const { uid } = yield select((state: RootState) => state.profile.profile);
  try {
    try {
      yield call(saveWeight, uid, weight);
      yield call(saveHeight, uid, height);
    } catch (e) {
      console.log(e);
    }

    const settings: SettingsState = yield select(
      (state: RootState) => state.settings,
    );
    const targets = settings.workoutGoals[goal] || null;
    const { profile } = yield select((state: RootState) => state.profile);
    yield call(
      api.updateUser,
      {
        ...profile,
        signedUp: true,
        ...action.payload,
        signUpDate: moment().unix(),
        targets,
      },
      profile.uid,
    );
    yield put(
      setProfile({
        ...profile,
        targets,
        ...action.payload,
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
      gender: gender || '',
      goal,
      uid: profile.uid || '',
    });
  } catch (e) {
    if (e instanceof Error) {
      Alert.alert('Error', e.message);
    }
  }
}

const WORKOUT_REMINDERS_ID = '1';
const TEST_REMINDERS_ID = '2';
export const WORKOUT_REMINDERS_CHANNEL_ID = 'WORKOUT_REMINDER_CHANNEL_ID';
export const TEST_REMINDERS_CHANNEL_ID = 'TEST_REMINDERS_CHANNEL_ID';
export const CONNECTION_ID = 'CONNECTION_ID';
export const MESSAGE_CHANNEL_ID = 'MESSAGE_CHANNEL_ID';
export const PLAN_CHANNEL_ID = 'PLAN_CHANNEL_ID';
export const GOALS_CHANNEL_ID = 'GOALS_CHANNEL_ID';
export const LEADERBOARD_CHANNEL_ID = 'LEADERBOARD_CHANNEL_ID';
export const DEFAULT_CHANNEL_ID = 'DEFAULT_CHANNEL_ID';

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
  {
    channelId: GOALS_CHANNEL_ID,
    channelName: 'Goal notifications',
    channelDescription: 'Channel for goal related notifications',
  },
  {
    channelId: LEADERBOARD_CHANNEL_ID,
    channelName: 'Leaderboards',
    channelDescription: 'Channel to give you updates about leaderboards',
  },

  {
    channelId: DEFAULT_CHANNEL_ID,
    channelName: 'Default channel',
    channelDescription: 'Used for admin notifications',
  },
];

function* createChannels() {
  if (Platform.OS === 'android') {
    channels.forEach(({ channelId, channelName, channelDescription }) => {
      Notifications.setNotificationChannelAsync(channelId, {
        name: channelName,
        importance: Notifications.AndroidImportance.MAX,
        description: channelDescription,
      });
    });
  }
}

function* getWeeklyItems() {
  try {
    yield put(setLoading(true));
    const { profile } = yield select((state: RootState) => state.profile);
    const weeklyItems: WeeklyItems = yield call(
      api.getWeeklyItems,
      profile.uid,
    );
    const { quickRoutines } = yield select(
      (state: RootState) => state.quickRoutines,
    );
    const missingRoutines = Object.values(weeklyItems.quickRoutines)
      .filter(item => !quickRoutines[item.quickRoutineId])
      .map(routine => routine.quickRoutineId);
    yield put(getQuickRoutinesById(missingRoutines));
    yield put(setWeeklyItems(weeklyItems));
    yield put(setLoading(false));
    yield call(scheduleGoalReminderNotification);

    const goalData = getGoalsData(weeklyItems, quickRoutines, profile.targets);
    if (Platform.OS === 'ios') {
      updateApplicationContext({ goalData });
    }
  } catch (e) {
    yield put(setLoading(false));
    logError(e);
    Snackbar.show({ text: 'Error fetching weekly data' });
  }
}

export const GOAL_REMINDER_KEY = 'GOAL_REMINDER_KEY';

export function* scheduleGoalReminderNotification() {
  const {
    profile,
    weeklyItems,
  }: { profile: Profile; weeklyItems: WeeklyItems } = yield select(
    (state: RootState) => state.profile,
  );
  const { quickRoutines } = yield select(
    (state: RootState) => state.quickRoutines,
  );
  if (profile.goal) {
    const { completed } = getGoalsData(
      weeklyItems,
      quickRoutines,
      profile.targets,
    );

    const WEEKDAY = 5;
    const HOURS = 9;
    const MINUTES = 0;
    const date = moment()
      .set('day', WEEKDAY)
      .set('hours', HOURS)
      .set('minutes', MINUTES);

    if (date.isAfter(moment())) {
      if (completed) {
        Notifications.cancelScheduledNotificationAsync(GOAL_REMINDER_KEY);
      } else if (profile.goalReminders) {
        Notifications.scheduleNotificationAsync({
          identifier: GOAL_REMINDER_KEY,
          content: {
            title: 'You’re almost there!',
            body: 'You’ve got just two days to hit your weekly targets',
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: WEEKDAY,
            hour: HOURS,
            minute: MINUTES,
            channelId: GOALS_CHANNEL_ID,
          },
        });
      }
    }
  }
}

function* getWeeklyItemsForConnection(action: PayloadAction<string>) {
  try {
    yield put(setLoading(true));
    const uid = action.payload;
    const weeklyItems: WeeklyItems = yield call(api.getWeeklyItems, uid);
    const { quickRoutines } = yield select(
      (state: RootState) => state.quickRoutines,
    );
    const missingRoutines = Object.values(weeklyItems.quickRoutines)
      .filter(item => !quickRoutines[item.quickRoutineId])
      .map(routine => routine.quickRoutineId);
    yield put(getQuickRoutinesById(missingRoutines));
    yield put(setWeeklyItemsForConnection({ uid, items: weeklyItems }));
    yield put(setLoading(false));
  } catch (e) {
    yield put(setLoading(false));
    logError(e);
    Snackbar.show({ text: 'Error fetching weekly data' });
  }
}

function* getConnections() {
  try {
    const { uid } = yield select((state: RootState) => state.profile.profile);
    yield put(setLoading(true));
    const connections: { [key: string]: Profile } = yield call(
      api.getConnections,
      uid,
    );
    const currentUnread: { [key: string]: number } = yield select(
      (state: RootState) => state.profile.profile.unread,
    );
    if (currentUnread) {
      // in case a friend had deleted their account we want to set unread back to 0
      const newUnread = Object.keys(currentUnread).reduce((acc, cur) => {
        if (connections[cur]) {
          return { ...acc, [cur]: currentUnread[cur] };
        }
        if (cur === 'plan') {
          return { ...acc, [cur]: currentUnread[cur] };
        }
        return acc;
      }, {});
      if (!_.isEqual(currentUnread, newUnread)) {
        yield call(api.setUnread, uid, newUnread);
        yield put(setUnread(newUnread));
      }
    }
    const chats: { [key: string]: Chat } = yield call(api.getChats, uid);
    yield put(setChats(chats));
    yield put(setConnections(connections));
    yield put(setLoading(false));
  } catch (e) {
    Snackbar.show({ text: 'Error fetching connections' });
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
          logError(error);
        },
      );

    return subscriber;
  });
}

function* chatWatcher(uid: string, chatsObj: { [key: string]: Chat }) {
  const channel: EventChannel<Snapshot> = yield call(
    onChatMessage,
    chatsObj[uid].id,
  );
  while (true) {
    const snapshot: Snapshot = yield take(channel);
    const messages = snapshot.docs.reduce(
      (acc: { [id: string]: Message }, cur) => {
        const message: any = cur.data();
        acc[message ? message._id : cur.id] = { ...message, id: cur.id };
        return acc;
      },
      {},
    );
    yield put(setMessages({ uid, messages }));
    for (const change of snapshot.docChanges()) {
      if (change.type === 'removed') {
        yield put(
          deleteMessage({ message: change.doc.data() as Message, uid }),
        );
      }
    }

    if (navigationRef.current) {
      const route: any = navigationRef.current.getCurrentRoute();
      const { state } = yield select((state: RootState) => state.profile);
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

function* chatsWatcher(action: PayloadAction<{ [key: string]: Chat }>) {
  const chatsObj = action.payload;
  const uids = Object.keys(chatsObj);
  for (const uid of uids) {
    yield fork(chatWatcher, uid, chatsObj);
  }
}

function* sendMessage(
  action: PayloadAction<{
    chatId: string;
    message: Message;
    uid: string;
    size?: number | null;
  }>,
) {
  const { chatId, uid } = action.payload;
  let message = action.payload.message;
  const fileSizeExceededMessage = 'File size limit exceeded';
  try {
    yield put(setMessage({ uid, message }));
    if (
      message.type === 'audio' ||
      message.type === 'image' ||
      message.type === 'video' ||
      message.type === 'document'
    ) {
      let compressedUri = '';
      if (message.type === 'image') {
        compressedUri = yield call(Image.compress, message.image || '');
      } else if (message.type === 'video') {
        compressedUri = yield call(Video.compress, message.video || '');
      } else if (message.type === 'audio') {
        compressedUri = yield call(Audio.compress, message.audio || '');
      } else if (message.type === 'document') {
        // Not sure if document compression is a thing so we'll leave it for now
        compressedUri = message.document || '';
      } else {
        throw new Error('Unsupported mime type');
      }

      let size = action.payload.size;
      try {
        if (message.type !== 'document') {
          const info = new FileSystem.File(compressedUri).info();
          size = info.size;
        }
      } catch (e) {
        logError(e);
      }

      const maxFileSize: number = yield select(
        (state: RootState) => state.settings.chatMaxFileSizeMb,
      );

      // file size comes back in bytes so need to divide by 1000000 to get mb
      if (size && size / 1000000 < maxFileSize) {
        const { profile } = yield select((state: RootState) => state.profile);
        const imageRef = storage()
          .ref(`chats/${profile.uid}`)
          .child(message._id as string);
        // yield call(imageRef.putFile, compressUri) doesn't work for some reason so we have to do this
        const putFile = async () => {
          await imageRef.putFile(compressedUri);
        };
        yield call(putFile);

        // same issue as above
        const getDownloadUrl = async () => {
          const url = await imageRef.getDownloadURL();
          return url;
        };

        const url: string = yield call(getDownloadUrl);

        message = {
          ...message,
          [message.type]: url,
        };
      } else {
        throw new Error(fileSizeExceededMessage);
      }
    }
    yield call(api.sendMessage, message, chatId, uid);
    notif.play();
  } catch (e) {
    if (e instanceof Error) {
      Snackbar.show({ text: e.message });
    }
    yield put(deleteMessage({ uid, message }));

    logError(e);
  }
}

function* requestMessageDeletionWorker(
  action: PayloadAction<{
    chatId: string;
    messageId: string;
    message: Message;
    uid: string;
  }>,
) {
  const { chatId, messageId, message, uid } = action.payload;
  try {
    yield call(api.deleteMessage, message, chatId, messageId);
    yield put(deleteMessage({ message, uid }));
  } catch (e) {
    Snackbar.show({ text: 'Error deleting message' });
    logError(e);
  }
}

function* setRead(action: PayloadAction<string>) {
  try {
    const otherUid = action.payload;
    const { uid } = yield select((state: RootState) => state.profile.profile);
    const current: { [key: string]: number } = yield select(
      (state: RootState) => state.profile.profile.unread,
    );
    if (current) {
      const unread = { ...current, [otherUid]: 0 };
      yield call(api.setUnread, uid, unread);
      yield put(setUnread(unread));
    }
  } catch (e) {
    logError(e);
  }
}

function* loadEarlierMessages(
  action: PayloadAction<{ chatId: string; uid: string; startAfter: number }>,
) {
  try {
    const { chatId, uid, startAfter } = action.payload;
    const { messages } = yield select((state: RootState) => state.profile);
    const current = messages[uid];
    yield put(setLoading(true));
    const earlier: { [key: string]: Message } = yield call(
      api.getMessages,
      chatId,
      startAfter,
    );
    yield put(setMessagesObj({ uid, messages: { ...current, ...earlier } }));
    yield put(setLoading(false));
  } catch (e) {
    yield put(setLoading(false));
    Snackbar.show({ text: 'Error loading earlier messages' });
    logError(e);
  }
}

function* premiumUpdatedWorker() {
  while (true) {
    const oldPremium: boolean = yield select(
      (state: RootState) => state.profile.profile.premium,
    );
    yield take(SET_PREMIUM);
    const { premium, uid } = yield select(
      (state: RootState) => state.profile.profile,
    );
    if (!_.isEqual(oldPremium, premium)) {
      yield call(api.updateUser, { premium }, uid);
    }
  }
}

function* checkDeviceInfoChanged() {
  try {
    const fontScale: number = yield call(PixelRatio.getFontScale);

    const deviceTypeMapping = {
      [Device.DeviceType.DESKTOP]: 'Desktop',
      [Device.DeviceType.PHONE]: 'Phone',
      [Device.DeviceType.TABLET]: 'Tablet',
      [Device.DeviceType.TV]: 'TV',
      [Device.DeviceType.UNKNOWN]: 'Unknown',
    };
    const deviceInfo: DeviceInfo = {
      fontScale,
      buildNumber: Application.nativeBuildVersion,
      version: Application.nativeApplicationVersion,
      brand: Device.brand,
      deviceType: Device.deviceType
        ? deviceTypeMapping[Device.deviceType]
        : 'Unknown',
      isTablet: Device.deviceType === Device.DeviceType.TABLET,
      os: Platform.OS,
    };

    const profile: Profile = yield select(
      (state: RootState) => state.profile.profile,
    );

    if (!_.isEqual(deviceInfo, profile.deviceInfo)) {
      yield call(api.updateUser, { deviceInfo }, profile.uid);
    }
  } catch (e) {
    logError(e);
  }
}

function* handleAuthWorker(action: PayloadAction<FirebaseAuthTypes.User>) {
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

      yield fork(getAllExercises);
      yield fork(getQuickRoutines);

      if (doc.exists()) {
        yield put(setProfile(doc.data() as Profile));
      } else {
        const reminderTime = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() + 1,
          9,
          0,
          0,
        ).toISOString();
        const userObj = {
          uid: user.uid,
          email: user.email || '',
          avatar: '',
          name: user.displayName || '',
          providerId: user.providerData[0].providerId || '',
          workoutReminders: true,
          workoutReminderTime: reminderTime,
          testReminderTime: reminderTime,
          testReminders: true,
          syncPlanWithCalendar: false,
          autoPlay: true,
          prepTime: 15,
          workoutMusic: true,
          goalReminders: true,
        };
        yield put(setProfile(userObj));
        yield call(api.setUser, userObj);
      }

      yield fork(checkWorkoutStreak);
      yield fork(premiumUpdatedWorker);
      const { customerInfo, created } = yield call(Purchases.logIn, user.uid);
      yield call(getSettings);
      const settings: SettingsState = yield select(
        (state: RootState) => state.settings,
      );

      const isAdmin = settings.admins.includes(user.uid);
      yield put(setAdmin(isAdmin));

      if (
        customerInfo.entitlements.active.Premium ||
        customerInfo.entitlements.active[PREMIUM_PLUS] ||
        isAdmin
      ) {
        yield put(setPremium(customerInfo.entitlements.active));
        yield fork(getConnections);
      } else {
        yield put(setPremium(false));
      }

      setUserAttributes({
        email: user.email || '',
        emailVerified: String(user.emailVerified),
        providerId: user.providerData[0].providerId,
        premium: customerInfo.entitlements.active.Premium ? 'true' : 'false',
        uid: user.uid || '',
        name: doc.exists() ? doc.data()?.name || '' : '',
        surname: doc.exists() ? doc.data()?.surname || '' : '',
      });

      Sentry.setUser({
        id: user.uid,
        email: user.email || '',
        username: doc.exists()
          ? `${doc.data()?.name} ${doc.data()?.surname || ''}`
          : '',
      });

      yield fork(checkDeviceInfoChanged);

      if (doc.exists() && doc.data()?.signedUp) {
        const available: boolean = yield call(isAvailable);
        if (available) {
          yield call(initBiometrics);
        }

        resetToTabs();
        yield put(updateProfileAction({ lastSeen: new Date() }));

        if (settings.promptUpdate && !__DEV__) {
          yield fork(
            checkVersion,
            Platform.OS === 'ios'
              ? settings.minIOSVersion
              : settings.minAndroidVersion,
          );
        }

        const { premium } = yield select(
          (state: RootState) => state.profile.profile,
        );
        if (doc.data()?.unread && premium) {
          yield put(setUnread(doc.data()?.unread));
        }
      } else {
        navigate('SignUpFlow');
      }
      yield put(setLoggedIn(true));
      yield fork(checkStepsCalories);
      yield fork(createChannels);
      const version = Platform.Version as number;
      if (Platform.OS === 'android' && version >= 33) {
        yield call(
          PermissionsAndroid.request,
          'android.permission.POST_NOTIFICATIONS',
        );
      }

      try {
        const authStatus: FirebaseMessagingTypes.AuthorizationStatus =
          yield call(messaging().requestPermission);

        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled && Device.isDevice) {
          const { data }: Notifications.DevicePushToken = yield call(
            Notifications.getDevicePushTokenAsync,
          );

          yield call(messaging().setAPNSToken, data);

          const FCMToken: string = yield call(messaging().getToken);
          api.setFCMToken(user.uid, FCMToken);
        }
      } catch (e) {
        logError(e);
      }
    } else if (user) {
      Alert.alert(
        'Account not verified',
        'Please verify your account using the link we sent to your email address, please also check your spam folder',
        [
          { text: 'Open email app', onPress: () => openInbox() },
          { text: 'Cancel', style: 'cancel' },
        ],
      );
      navigate('LoginEmail');
    } else {
      yield put(setLoggedIn(false));
      navigate('Login');
    }
  } catch (e: any) {
    console.log(e);
    if (e.code === statusCodes.SIGN_IN_CANCELLED) {
      return;
    }
    navigate('Login');

    const state: NetInfoState = yield call(fetch);
    if (state.isConnected && state.isInternetReachable) {
      logError(e);
      if (e instanceof Error) {
        Alert.alert('Error', e.message);
      }
    } else {
      navigate('Offline');
    }
  }
}

export function* feedbackTrigger() {
  const { premium, hasLeftFeedback, dontAskAgain } = yield select(
    (state: RootState) => state.profile.profile,
  );

  if (!premium && !hasLeftFeedback && !dontAskAgain) {
    yield call(
      Alert.alert,
      'Enjoying the app?',
      "We'd appreciated it if you'd take some time to leave some feedback?",
      [
        { text: 'Maybe later' },
        {
          text: "Don't ask me again",
          style: 'destructive',
          onPress: () => {
            store.dispatch(
              updateProfileAction({
                disableSnackbar: true,
                dontAskAgain: true,
              }),
            );
          },
        },
        {
          text: 'Ok',
          onPress: () => {
            navigate('Rating');
          },
        },
      ],
    );
  }
}

function* unreadWatcher({ payload }: PayloadAction<{ [key: string]: number }>) {
  const count = Object.values(payload).reduce((acc, cur) => acc + cur, 0);
  yield call(Notifications.setBadgeCountAsync, count);
}

function* onTokenRefresh() {
  return eventChannel(emitter => {
    const unsubscribe = messaging().onTokenRefresh(token => {
      emitter({ token });
    });

    return unsubscribe;
  });
}

function* tokenWatcher() {
  const channel: EventChannel<{ token: string }> = yield call(onTokenRefresh);

  while (true) {
    const { token } = yield take(channel);
    try {
      const { uid } = yield select((state: RootState) => state.profile.profile);
      if (uid) {
        api.setFCMToken(uid, token);
      }
    } catch (e) {
      logError(e);
    }
  }
}

export default function* profileSaga() {
  yield all([
    throttle(3000, SIGN_UP, signUp),
    takeLatest(GET_SAMPLES, getSamplesWorker),
    debounce(1000, UPDATE_PROFILE, updateProfile),
    debounce(3000, HANDLE_AUTH, handleAuthWorker),
    throttle(1000, GET_CONNECTIONS, getConnections),
    takeLatest(SEND_MESSAGE, sendMessage),
    throttle(3000, REQUEST_MESSAGE_DELETION, requestMessageDeletionWorker),
    debounce(1000, SET_READ, setRead),
    takeLatest(SET_CHATS, chatsWatcher),
    takeLatest(SET_UNREAD, unreadWatcher),
    takeLatest(LOAD_EARLIER_MESSAGES, loadEarlierMessages),
    throttle(3000, GET_WEEKLY_ITEMS, getWeeklyItems),
    throttle(
      3000,
      GET_WEEKLY_ITEMS_FOR_CONNECTION,
      getWeeklyItemsForConnection,
    ),
    debounce(3000, SET_PREMIUM, premiumUpdatedWorker),
    fork(tokenWatcher),
  ]);

  const channel: EventChannel<{ user: FirebaseAuthTypes.User }> =
    yield call(onAuthStateChanged);
  while (true) {
    const { user }: { user: FirebaseAuthTypes.User } = yield take(channel);
    yield put(handleAuth(user));
  }
}
