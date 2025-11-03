import { PayloadAction } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react-native';
import * as _ from 'lodash';
import moment from 'moment';
import { Platform } from 'react-native';
// @TODO replace with expo background task
// import BackgroundFetch from 'react-native-background-fetch';
import {
  Permission,
  getGrantedPermissions,
  initialize,
} from 'react-native-health-connect';
import Snackbar from 'react-native-snackbar';
import { EventChannel, eventChannel } from 'redux-saga';
import {
  all,
  call,
  debounce,
  fork,
  put,
  select,
  take,
} from 'redux-saga/effects';
import { RootState } from '../App';
import * as api from '../helpers/api';
import { getStepSamples } from '../helpers/biometrics';
import { logError } from '../helpers/error';
import { getGoalsData } from '../helpers/goals';
import { CHECK_STEPS_CALORIES } from '../reducers/exercises';
import {
  GET_LEADERBOARD,
  setLeaderboard,
  setLeaderboardsLoading,
} from '../reducers/leaderboards';
import { ProfileState, updateProfile } from '../reducers/profile';
import {
  LeaderboardItem,
  LeaderboardType,
  Sample,
  UpdateProfilePayload,
} from '../types/Shared';

export function* getLeaderboard(action: PayloadAction<LeaderboardType>) {
  try {
    yield put(setLeaderboardsLoading(true));
    const { payload } = action;
    const { profile } = yield select((state: RootState) => state.profile);

    if (profile.premium && profile.optedInToLeaderboards) {
      const data: { leaderboard: LeaderboardItem[]; endTime: number } =
        yield call(api.getLeaderboardData, payload);

      yield put(
        setLeaderboard({
          type: payload,
          leaderboard: data.leaderboard,
          endTime: data.endTime,
        }),
      );
    }
  } catch (e) {
    Snackbar.show({ text: 'Error fetching leaderboard' });
    logError(e);
  }
  yield put(setLeaderboardsLoading(false));
}

export function* checkStepsCalories(background?: boolean) {
  try {
    if (background) {
      Sentry.addBreadcrumb({
        message: 'User opted into leaderboards, now fetching samples...',
        level: 'info',
      });
    }
    const profileState: ProfileState = yield select(
      (state: RootState) => state.profile,
    );

    const { quickRoutines } = yield select(
      (state: RootState) => state.quickRoutines,
    );

    const { loggedIn, weeklyItems } = profileState;
    const {
      dailySteps,
      weeklySteps,
      targets,
      weeklyCalories,
      dailyCalories,
      uid,
    } = profileState.profile;

    let updatePayload: UpdateProfilePayload = { disableSnackbar: true };

    if (loggedIn) {
      if (background) {
        Sentry.addBreadcrumb({
          message: 'User logged into, continuing with fetching samples...',
          level: 'info',
        });
      }

      if (Platform.OS === 'android') {
        const initialized: boolean = yield call(initialize);
        if (!initialized) {
          return;
        }

        const permissions: Permission[] = yield call(getGrantedPermissions);
        if (
          !permissions.some(permission => permission.recordType === 'Steps')
        ) {
          return;
        }
      }

      const dailyStepsSamples: Sample[] = yield call(getStepSamples);
      if (dailyStepsSamples) {
        const steps = dailyStepsSamples.reduce(
          (acc, cur) => acc + cur.value,
          0,
        );

        if (steps !== dailySteps) {
          updatePayload = { ...updatePayload, dailySteps: steps };
        }
      }
      if (background) {
        Sentry.addBreadcrumb({
          message: 'User daily steps fetched',
          data: updatePayload,
          level: 'info',
        });
      }
      const weeklyStepsSamples: Sample[] = yield call(
        getStepSamples,
        moment().utc().startOf('isoWeek').toDate(),
        moment().utc().endOf('day').toDate(),
      );

      if (weeklyStepsSamples) {
        const steps = weeklyStepsSamples.reduce(
          (acc, cur) => acc + cur.value,
          0,
        );

        if (steps !== weeklySteps) {
          updatePayload = { ...updatePayload, weeklySteps: steps };
        }
      }
      if (background) {
        Sentry.addBreadcrumb({
          message: 'User weekly steps fetched',
          data: updatePayload,
          level: 'info',
        });
      }

      const { calories, dailyCalories: dCalories } = getGoalsData(
        weeklyItems,
        quickRoutines,
        targets,
      );

      // const activitySamples = yield call(
      //   getActivitySamples,
      //   moment().subtract(2, 'year').startOf('day').toDate(),
      //   moment().toDate(),
      // );

      const higherDailyCalories = _.max([dCalories]);

      if (
        higherDailyCalories !== undefined &&
        higherDailyCalories !== dailyCalories
      ) {
        updatePayload = {
          ...updatePayload,
          dailyCalories: higherDailyCalories,
        };
      }

      // const weeklyCalorieSamples: Sample[] = yield call(
      //   getCalorieSamples,
      //   moment().startOf('isoWeek').toDate(),
      //   moment().toDate(),
      // );

      // const weeklyCalorieSamplesCombined = Math.round(
      //   weeklyCalorieSamples.reduce((acc, cur) => acc + cur.value, 0),
      // );

      const higherWeeklyCalories = _.max([
        // weeklyCalorieSamplesCombined,
        calories,
      ]);

      if (
        higherWeeklyCalories !== undefined &&
        higherWeeklyCalories !== weeklyCalories
      ) {
        updatePayload = {
          ...updatePayload,
          weeklyCalories: higherWeeklyCalories,
        };
      }

      if (Object.values(updatePayload).length > 1) {
        // do this check to avoid updating steps when on simulator
        if (!__DEV__) {
          if (background) {
            Sentry.addBreadcrumb({
              message: 'Update payload has items, updating user...',
              data: updatePayload,
              level: 'info',
            });
            yield call(api.updateUser, updatePayload, uid);
          } else {
            yield put(updateProfile(updatePayload));
          }
        }
      }
    }
  } catch (e) {
    logError(e);
  }
}

function* handleBackgroundFetchEvent(action: {
  taskId: string;
  timeout?: boolean;
}) {
  const { taskId, timeout } = action;
  if (timeout) {
    // BackgroundFetch.finish(taskId);
    logError(new Error('Task timed out'));
  } else {
    const { profile } = yield select((state: RootState) => state.profile);
    if (profile.premium && profile.optedInToLeaderboards) {
      yield call(checkStepsCalories, true);
    }
    // BackgroundFetch.finish(taskId);
  }
}

function createBackgroundFetchChannel() {
  return eventChannel(emitter => {
    const onEvent = async (taskId: string) => {
      emitter({ taskId });
    };

    const onTimeout = async (taskId: string) => {
      emitter({ taskId, timeout: true });
    };

    // BackgroundFetch.configure(
    //   {
    //     minimumFetchInterval: 15,
    //     enableHeadless: true,
    //     stopOnTerminate: false,
    //     requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
    //   },
    //   onEvent,
    //   onTimeout,
    // ).then(status => {
    //   console.log('[BackgroundFetch] configure status: ', status);
    // });

    return () => {
      // Cleanup function (if needed)
    };
  });
}

export default function* leaderboardsSaga() {
  yield all([
    debounce(1000, GET_LEADERBOARD, getLeaderboard),
    debounce(1000, CHECK_STEPS_CALORIES, checkStepsCalories),
  ]);

  const backgroundFetchChannel: EventChannel<{
    taskId: string;
    timeout?: boolean;
  }> = yield call(createBackgroundFetchChannel);
  while (true) {
    const { taskId, timeout } = yield take(backgroundFetchChannel);
    yield fork(handleBackgroundFetchEvent, { taskId, timeout });
  }
}
