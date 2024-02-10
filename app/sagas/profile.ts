import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {EventChannel, eventChannel} from '@redux-saga/core';
import moment from 'moment';
import PushNotification from 'react-native-push-notification';
import {
  all,
  call,
  debounce,
  fork,
  put,
  select,
  take,
  takeLatest,
  throttle,
} from 'redux-saga/effects';

import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import db from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import storage from '@react-native-firebase/storage';
import {statusCodes} from '@react-native-google-signin/google-signin';
import {PayloadAction} from '@reduxjs/toolkit';
import _ from 'lodash';
import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import {Audio, Image, Video} from 'react-native-compressor';
import RNFS from 'react-native-fs';
import googleFit from 'react-native-google-fit';
import Purchases from 'react-native-purchases';
import Snackbar from 'react-native-snackbar';
import Sound from 'react-native-sound';
import {goBack, navigate, navigationRef, resetToTabs} from '../RootNavigation';
import {scheduleLocalNotification} from '../helpers';
import * as api from '../helpers/api';
import {
  getBodyFatPercentageSamples,
  getBoneMassSamples,
  getHeightSamples,
  getMuscleMassSamples,
  getWeightSamples,
  initBiometrics,
  isAvailable,
  isEnabled,
  saveBodyFatPercentage,
  saveBoneMass,
  saveHeight,
  saveMuscleMass,
  saveWeight,
} from '../helpers/biometrics';
import {logError} from '../helpers/error';
import {getGoalsData} from '../helpers/goals';
import {getProfileImage} from '../helpers/images';
import isTestFlight from '../helpers/isTestFlight';
import {setUserAttributes} from '../helpers/profile';
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
  setMuscleMassSamples,
  setPremium,
  setProfile,
  setUnread,
  setWeeklyItems,
  setWeeklyItemsForConnection,
  setWeightSamples,
} from '../reducers/profile';
import {getQuickRoutinesById} from '../reducers/quickRoutines';
import {SettingsState} from '../reducers/settings';
import Chat from '../types/Chat';
import Message from '../types/Message';
import Profile from '../types/Profile';
import {
  MyRootState,
  Sample,
  SignUpPayload,
  UpdateProfilePayload,
} from '../types/Shared';
import {handleDeepLink} from './exercises';
import {getSettings} from './settings';
import { PREMIUM_PLUS } from '../helpers/hasPremiumPlus';

const notif = new Sound('notif.wav', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
  }
});

export const workoutSong = new Sound(
  'workout_song.mp3',
  Sound.MAIN_BUNDLE,
  error => {
    if (error) {
      console.log('failed to load the sound', error);
    }
  },
);

workoutSong.setNumberOfLoops(-1);

type Snapshot =
  FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>;

function* getSamplesWorker() {
  const {uid} = yield select((state: MyRootState) => state.profile.profile);
  const weightSamples: Sample[] = yield call(getWeightSamples, 'metric');
  yield put(setWeightSamples(weightSamples));

  const heightSamples: Sample[] = yield call(getHeightSamples, 'metric');
  yield put(setHeightSamples(heightSamples));

  const bodyFatPercentageSamples: Sample[] = yield call(
    getBodyFatPercentageSamples,
    uid,
  );

  yield put(setBodyFatPercentageSamples(bodyFatPercentageSamples));

  const muscleMassSamples: Sample[] = yield call(getMuscleMassSamples, uid);
  yield put(setMuscleMassSamples(muscleMassSamples));

  const boneMassSamples: Sample[] = yield call(getBoneMassSamples, uid);
  yield put(setBoneMassSamples(boneMassSamples));

  // const stepSamples: StepSample[] = yield call(getStepSamples);
  // yield put(setStepSamples(stepSamples));

  // const activitySamples: HealthValue[] | ActivitySampleResponse[] = yield call(
  //   getActivitySamples,
  // );

  // if (activitySamples) {
  // }

  // const weeklySteps: StepSample[] = yield call(getWeeklySteps);
  // if (Platform.OS === 'ios') {
  //   const aggregatedWeeklySteps = Object.values(
  //     weeklySteps.reduce(
  //       (acc: {[key: string]: {date: string; value: number}}, cur) => {
  //         const date = moment(cur.date).format('YYYY-MM-DD');
  //         if (acc[date]) {
  //           acc[date] = {date, value: acc[date].value + cur.value};
  //         } else {
  //           acc[date] = {date, value: cur.value};
  //         }
  //         return acc;
  //       },
  //       {},
  //     ),
  //   );
  //   yield put(setWeeklySteps(aggregatedWeeklySteps));
  // } else {
  //   yield put(setWeeklySteps(weeklySteps));
  // }
}

function onAuthStateChanged() {
  return eventChannel(emitter => {
    const subscriber = auth().onAuthStateChanged(user => {
      emitter({user});
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
  } = action.payload;
  yield put(setLoading(true));
  try {
    try {
      const {uid} = yield select((state: MyRootState) => state.profile.profile);
      const enabled: boolean = yield call(isEnabled);
      if (enabled) {
        if (weight) {
          yield call(saveWeight, weight, 'metric');
        }
        if (height) {
          yield call(saveHeight, height, 'metric');
        }
        if (bodyFatPercentage !== undefined) {
          yield call(saveBodyFatPercentage, bodyFatPercentage, uid);
        }
        if (muscleMass !== undefined) {
          yield call(saveMuscleMass, muscleMass, uid);
        }
        if (boneMass !== undefined) {
          yield call(saveBoneMass, boneMass, uid);
        }
      }
    } catch (e) {
      Alert.alert(
        'Error saving body measurement',
        "Please make sure you've given CA Health sufficient permissions",
        [
          {text: 'Cancel'},
          {
            text: `Open ${
              Platform.OS === 'ios' ? 'Apple Health' : 'Google Fit'
            }`,
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('health://');
              } else {
                googleFit.openFit();
              }
            },
          },
        ],
      );

      logError(e);
    }
    const {profile} = yield select((state: MyRootState) => state.profile);
    const updateObj = {
      ...profile,
      ...action.payload,
    };
    yield call(api.updateUser, updateObj, profile.uid);
    yield put(setProfile(updateObj));
    yield call(Snackbar.show, {text: 'Profile updated'});
    setUserAttributes({
      birthday: dob || '',
      weight: weight?.toString() || '',
      height: height?.toString() || '',
      unit: 'metric',
      gender: gender || '',
      goal: goal || '',
      uid: profile.uid || '',
    });
    if (!goalReminders) {
      PushNotification.cancelLocalNotification(GOAL_REMINDER_KEY);
    }
  } catch (e) {
    yield call(Snackbar.show, {text: 'Error updating profile'});
    logError(e);
  }
  yield put(setLoading(false));
}

function* signUp(action: PayloadAction<SignUpPayload>) {
  const {name, surname, dob, weight, height, gender, goal, fromProfile} =
    action.payload;
  try {
    try {
      const enabled: boolean = yield call(isEnabled);
      if (enabled) {
        yield call(saveWeight, weight);
        yield call(saveHeight, height);
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
        ...action.payload,
        signUpDate: moment().unix(),
      },
      profile.uid,
    );
    yield put(
      setProfile({
        ...profile,
        ...action.payload,
      }),
    );
    if (fromProfile) {
      goBack();
    } else {
      PushNotification.localNotification({
        title: 'Great start you’ve set your goal!',
        message:
          'Well done for setting your first goal! Make sure you stay on track to hit your weekly targets by checking your profile tab!',
        channelId: GOALS_CHANNEL_ID,
      });
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
    yield call(scheduleGoalReminderNotification);
  } catch (e) {
    yield put(setLoading(false));
    logError(e);
    Snackbar.show({text: 'Error fetching weekly data'});
  }
}

export const GOAL_REMINDER_KEY = 'goalReminder';

export function* scheduleGoalReminderNotification() {
  const {profile, weeklyItems}: {profile: Profile; weeklyItems: WeeklyItems} =
    yield select((state: MyRootState) => state.profile);
  const {quickRoutines} = yield select(
    (state: MyRootState) => state.quickRoutines,
  );
  const settings: SettingsState = yield select(
    (state: MyRootState) => state.settings,
  );
  if (profile.goal) {
    const {completed} = getGoalsData(
      profile.goal,
      weeklyItems,
      quickRoutines,
      settings,
    );
    const date = moment().set('day', 5).set('hours', 9).set('minutes', 0);

    if (date.isAfter(moment())) {
      if (completed) {
        PushNotification.cancelLocalNotification(GOAL_REMINDER_KEY);
      } else if (profile.goalReminders) {
        scheduleLocalNotification(
          'You’ve got just two days to hit your weekly targets',
          date.toDate(),
          GOALS_CHANNEL_ID,
          'You’re almost there!',
          GOAL_REMINDER_KEY,
          'week',
        );
      }
    }
  }
}

function* getWeeklyItemsForConnection(action: PayloadAction<string>) {
  try {
    yield put(setLoading(true));
    const uid = action.payload;
    const weeklyItems: WeeklyItems = yield call(api.getWeeklyItems, uid);
    const {quickRoutines} = yield select(
      (state: MyRootState) => state.quickRoutines,
    );
    const missingRoutines = Object.values(weeklyItems.quickRoutines)
      .filter(item => !quickRoutines[item.quickRoutineId])
      .map(routine => routine.quickRoutineId);
    yield put(getQuickRoutinesById(missingRoutines));
    yield put(setWeeklyItemsForConnection({uid, items: weeklyItems}));
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
    const currentUnread: {[key: string]: number} = yield select(
      (state: MyRootState) => state.profile.profile.unread,
    );
    if (currentUnread) {
      // in case a friend had deleted their account we want to set unread back to 0
      const newUnread = Object.keys(currentUnread).reduce((acc, cur) => {
        if (connections[cur]) {
          return {...acc, [cur]: currentUnread[cur]};
        }
        if (cur === 'plan') {
          return {...acc, [cur]: currentUnread[cur]};
        }
        return acc;
      }, {});
      if (!_.isEqual(currentUnread, newUnread)) {
        yield call(api.setUnread, uid, newUnread);
        yield put(setUnread(newUnread));
      }
    }
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
    yield put(setMessages({uid, snapshot}));
    for (const change of snapshot.docChanges()) {
      if (change.type === 'removed') {
        yield put(deleteMessage({message: change.doc.data() as Message, uid}));
      }
    }

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

function* chatsWatcher(action: PayloadAction<{[key: string]: Chat}>) {
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
  const {chatId, uid} = action.payload;
  let message = action.payload.message;
  const fileSizeExceededMessage = 'File size limit exceeded';
  try {
    yield put(setMessage({uid, message}));
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
          const read: RNFS.StatResult = yield call(RNFS.stat, compressedUri);
          size = read.size;
        }
      } catch (e) {
        logError(e);
      }

      const maxFileSize: number = yield select(
        (state: MyRootState) => state.settings.chatMaxFileSizeMb,
      );

      // file size comes back in bytes so need to divide by 1000000 to get mb
      if (size && size / 1000000 < maxFileSize) {
        const {profile} = yield select((state: MyRootState) => state.profile);
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
      Snackbar.show({text: e.message});
    }
    yield put(deleteMessage({uid, message}));

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
  const {chatId, messageId, message, uid} = action.payload;
  try {
    yield call(api.deleteMessage, message, chatId, messageId);
    yield put(deleteMessage({message, uid}));
  } catch (e) {
    Snackbar.show({text: 'Error deleting message'});
    logError(e);
  }
}

function* setRead(action: PayloadAction<string>) {
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

function* loadEarlierMessages(
  action: PayloadAction<{chatId: string; uid: string; startAfter: number}>,
) {
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
    yield put(setMessagesObj({uid, messages: {...current, ...earlier}}));
    yield put(setLoading(false));
  } catch (e) {
    yield put(setLoading(false));
    Snackbar.show({text: 'Error loading earlier messages'});
    logError(e);
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
    if (!_.isEqual(oldPremium, premium)) {
      yield call(api.updateUser, {premium}, uid);
    }
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

      if (doc.exists) {
        yield put(setProfile(doc.data() as Profile));
      } else {
        const avatar = getProfileImage(user);
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
          avatar: avatar || '',
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
      yield fork(premiumUpdatedWorker);
      const {customerInfo, created} = yield call(Purchases.logIn, user.uid);
      yield call(getSettings);
      const settings: SettingsState = yield select(
        (state: MyRootState) => state.settings,
      );
      const isAdmin = settings.admins.includes(user.uid);
      yield put(setAdmin(isAdmin));
      if (
        customerInfo.entitlements.active.Premium ||
        customerInfo.entitlements.active[PREMIUM_PLUS] ||
        isAdmin ||
        isTestFlight()
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
        name: doc.exists ? doc.data()?.name || '' : '',
        surname: doc.exists ? doc.data()?.surname || '' : '',
      });

      if (doc.exists && doc.data()?.signedUp) {
        const available: boolean = yield call(isAvailable);
        if (available) {
          yield call(initBiometrics);
        }
        resetToTabs();
        try {
          const getLinkPromise = () => {
            return new Promise<FirebaseDynamicLinksTypes.DynamicLink | null>(
              resolve => {
                dynamicLinks()
                  .getInitialLink()
                  .then(link => {
                    resolve(link);
                  });
              },
            );
          };
          const link: FirebaseDynamicLinksTypes.DynamicLink = yield call(
            getLinkPromise,
          );

          if (link && link.url) {
            yield call(handleDeepLink, link.url);
          }
        } catch (e: unknown) {
          logError(e);
        }

        const {premium} = yield select(
          (state: MyRootState) => state.profile.profile,
        );
        if (doc.data()?.unread && premium) {
          yield put(setUnread(doc.data()?.unread));
        }
      } else {
        navigate('SignUpFlow');
      }
      yield put(setLoggedIn(true));

      yield fork(createChannels);
      const version = Platform.Version as number;
      if (Platform.OS === 'android' && version >= 33) {
        yield call(
          PermissionsAndroid.request,
          'android.permission.POST_NOTIFICATIONS',
        );
      }
      messaging()
        .requestPermission()
        .then(async authStatus => {
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
          if (enabled) {
            try {
              const FCMToken = await messaging().getToken();
              api.setFCMToken(user.uid, FCMToken);
            } catch (e) {
              logError(e);
            }
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
  } catch (e: any) {
    if (e.code === statusCodes.SIGN_IN_CANCELLED) {
      return;
    }
    navigate('Login');
    logError(e);
    if (e instanceof Error) {
      Alert.alert('Error', e.message);
    }
  }
}

export default function* profileSaga() {
  yield all([
    throttle(3000, SIGN_UP, signUp),
    takeLatest(GET_SAMPLES, getSamplesWorker),
    throttle(3000, UPDATE_PROFILE, updateProfile),
    debounce(3000, HANDLE_AUTH, handleAuthWorker),
    throttle(1000, GET_CONNECTIONS, getConnections),
    takeLatest(SEND_MESSAGE, sendMessage),
    throttle(3000, REQUEST_MESSAGE_DELETION, requestMessageDeletionWorker),
    debounce(1000, SET_READ, setRead),
    takeLatest(SET_CHATS, chatsWatcher),
    takeLatest(LOAD_EARLIER_MESSAGES, loadEarlierMessages),
    throttle(3000, GET_WEEKLY_ITEMS, getWeeklyItems),
    throttle(
      3000,
      GET_WEEKLY_ITEMS_FOR_CONNECTION,
      getWeeklyItemsForConnection,
    ),
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
