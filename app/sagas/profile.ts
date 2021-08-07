import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import Shake from '@shakebugs/react-native-shake';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';
import PushNotification from 'react-native-push-notification';
import {eventChannel} from '@redux-saga/core';
import {EventChannel} from '@redux-saga/core';
import RNFetchBlob, {FetchBlobResponse} from 'rn-fetch-blob';
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
  setWorkoutReminders,
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
} from '../actions/profile';
import {getTests} from '../actions/tests';
import {getProfileImage} from '../helpers/images';
import Profile from '../types/Profile';
import {MyRootState, Sample, StepSample} from '../types/Shared';
import * as api from '../helpers/api';
import {goBack, navigate, resetToTabs} from '../RootNavigation';
import {Alert, Platform} from 'react-native';
import {
  getActivitySamples,
  getStepSamples,
  getWeeklySteps,
  getWeightSamples,
  initBiometrics,
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
} from '../actions/exercises';
import Exercise from '../types/Exercise';

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
  yield call(api.updateUser, {
    ...profile,
    ...(dob ? {dob} : {}),
    ...(weight ? {weight} : {}),
    ...(height ? {height} : {}),
    ...(unit ? {unit} : {}),
    ...(gender ? {gender} : {}),
    ...(goals ? {goals} : {}),
    ...(workoutFrequency ? {workoutFrequency} : {}),
    ...(purpose ? {purpose} : {}),
  });
  yield put(
    setProfile({
      ...profile,
      ...(dob ? {dob} : {}),
      ...(weight ? {weight} : {}),
      ...(height ? {height} : {}),
      ...(unit ? {unit} : {}),
      ...(gender ? {gender} : {}),
      ...(goals ? {goals} : {}),
      ...(workoutFrequency ? {workoutFrequency} : {}),
      ...(purpose ? {purpose} : {}),
    }),
  );
  yield call(Snackbar.show, {text: 'Profile updated'});
}

function* downloadVideoWorker(action: DownloadVideoAction) {
  const id = action.payload;
  const {exercises, videos} = yield select(
    (state: MyRootState) => state.exercises,
  );
  const exercise: Exercise = exercises[id];
  const video: {src: string; path: string} | undefined = videos[id];
  if (exercise.video) {
    if (!video || video.src !== exercise.video.src) {
      try {
        const dirs = RNFetchBlob.fs.dirs;
        const response: FetchBlobResponse = yield call(
          RNFetchBlob.config({
            fileCache: true,
            path: `${dirs.DocumentDir}/${id}${
              Platform.OS === 'ios' ? '.mp4' : ''
            }`,
          }).fetch,
          'GET',
          exercise.video.src,
        );
        const path = response.path();
        yield put(setVideo(id, exercise.video.src, path));
      } catch (e) {
        yield call(
          Alert.alert,
          'Error',
          `Error downloading video: ${e.message}`,
        );
      }
    }
  } else {
    yield call(
      Alert.alert,
      'Sorry',
      'Video has not yet been uploaded for this exercise',
    );
  }
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
    }
  } catch (e) {
    Alert.alert('Error', e.nativeErrorMessage || e.message);
  }
  yield put(setStep(0));
}

const WORKOUT_REMINDERS_ID = 1;
const MONTHLY_TEST_REMINDERS_ID = 2;
const WORKOUT_REMINDERS_CHANNEL_ID = 'WORKOUT_REMINDER_CHANNEL_ID';
const MONTHLY_TEST_REMINDERS_CHANNEL_ID = 'MONTHLY_TEST_REMINDERS_CHANNEL_ID';

function* getWorkoutReminders() {
  const {workoutReminderTime, monthlyTestReminders} = yield select(
    (state: MyRootState) => state.profile,
  );

  PushNotification.createChannel(
    {
      channelId: WORKOUT_REMINDERS_CHANNEL_ID,
      channelName: 'Workout reminders',
      channelDescription: 'Daily reminders to workout',
    },
    created => console.log('channel created', created),
  );

  PushNotification.createChannel(
    {
      channelId: MONTHLY_TEST_REMINDERS_CHANNEL_ID,
      channelName: 'Monthly reminders',
      channelDescription: 'Monthly reminders to take a fitness test',
    },
    created => console.log('channel created', created),
  );

  yield put(setWorkoutReminderTime(new Date(workoutReminderTime)));
  yield put(setMonthlyTestReminders(monthlyTestReminders));
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
    PushNotification.cancelLocalNotifications({id: `${WORKOUT_REMINDERS_ID}`});
  }
}

function* setWorkoutReminderTimeWorker(action: SetWorkoutReminderTimeAction) {
  const time = action.payload;
  const {workoutReminders} = yield select(
    (state: MyRootState) => state.profile,
  );

  if (workoutReminders) {
    PushNotification.cancelLocalNotifications({id: `${WORKOUT_REMINDERS_ID}`});
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
    PushNotification.cancelLocalNotifications({
      id: `${MONTHLY_TEST_REMINDERS_ID}`,
    });
  }
}

function* handleAuthWorker(action: HandleAuthAction) {
  const user = action.payload;
  try {
    if (user && user.emailVerified) {
      Shake.setMetadata('uid', user.uid);
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
        };
        yield put(setProfile(userObj));
        yield call(api.setUser, userObj);
      }

      if (doc.exists && doc.data().signedUp) {
        yield call(initBiometrics);
        resetToTabs();
      } else {
        navigate('SignUpFlow');
        yield put(setStep(0));
      }
      yield put(setLoggedIn(true));
      yield put(getTests());
      yield fork(getWorkoutReminders);
    } else if (user) {
      Alert.alert(
        'Account not verified',
        'Please verify your account using the link we sent to your email address',
      );
    } else {
      yield put(setLoggedIn(false));
    }
  } catch (e) {
    crashlytics().recordError(e);
    console.log(e);
  }
}

export default function* profileSaga() {
  yield all([
    takeEvery(SIGN_UP, signUp),
    takeEvery(GET_SAMPLES, getSamplesWorker),
    takeEvery(UPDATE_PROFILE, updateProfile),
    takeLatest(SET_WORKOUT_REMINDERS, setWorkoutRemindersWorker),
    takeLatest(SET_WORKOUT_REMINDER_TIME, setWorkoutReminderTimeWorker),
    takeLatest(SET_MONTHLY_TEST_REMINDERS, setMonthlyTestRemindersWorker),
    takeLatest(HANDLE_AUTH, handleAuthWorker),
    takeLatest(DOWNLOAD_VIDEO, downloadVideoWorker),
  ]);

  const channel: EventChannel<{user: FirebaseAuthTypes.User}> = yield call(
    onAuthStateChanged,
  );
  while (true) {
    const {user}: {user: FirebaseAuthTypes.User} = yield take(channel);
    yield put(handleAuth(user));
  }
}
