//import './wdyr';
import * as Sentry from '@sentry/react-native';
import moment from 'moment';
import {AppRegistry} from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import {name as appName} from './app.json';
import App, {store} from './app/App';
import * as api from './app/helpers/api';
import {getStepSamples} from './app/helpers/biometrics';
import {logError} from './app/helpers/error';

let MyHeadlessTask = async event => {
  // Get task id from event {}:
  let taskId = event.taskId;
  let isTimeout = event.timeout; // <-- true when your background-time has expired.
  if (isTimeout) {
    // This task has exceeded its allowed running-time.
    // You must stop what you're doing immediately finish(taskId)
    console.log('[BackgroundFetch] Headless TIMEOUT:', taskId);
    logError(new Error('Task timed out'));
    BackgroundFetch.finish(taskId);
    return;
  }
  console.log('[BackgroundFetch HeadlessTask] start: ', taskId);
  try {
    const {profile} = store.getState().profile;

    const {premium, optedInToLeaderboards, dailySteps, weeklySteps} = profile;

    let updatePayload = {};

    if (premium && optedInToLeaderboards) {
      Sentry.addBreadcrumb({
        message: 'User opted into leaderboards, now fetching samples...',
        level: 'info',
      });

      const dailyStepsSamples = await getStepSamples();

      if (dailyStepsSamples) {
        const steps = dailyStepsSamples.reduce(
          (acc, cur) => acc + cur.value,
          0,
        );

        if (steps !== dailySteps) {
          updatePayload = {...updatePayload, dailySteps: steps};
        }
      }

      Sentry.addBreadcrumb({
        message: 'User daily steps fetched',
        data: updatePayload,
        level: 'info',
      });

      const weeklyStepsSamples = await getStepSamples(
        moment().utc().startOf('isoWeek').toDate(),
        moment().utc().endOf('day').toDate(),
      );
      if (weeklyStepsSamples) {
        const steps = weeklyStepsSamples.reduce(
          (acc, cur) => acc + cur.value,
          0,
        );

        if (steps !== weeklySteps) {
          updatePayload = {...updatePayload, weeklySteps: steps};
        }
      }

      Sentry.addBreadcrumb({
        message: 'User weekly steps fetched',
        data: updatePayload,
        level: 'info',
      });

      if (Object.values(updatePayload).length > 0) {
        // do this check to avoid updating steps when on simulator
        if (!__DEV__) {
          Sentry.addBreadcrumb({
            message: 'Update payload has items, updating user...',
            data: updatePayload,
            level: 'info',
          });
          await api.updateUser(updatePayload, profile.uid);
        }
      }
    }
  } catch (e) {
    logError(e);
  }

  // Required:  Signal to native code that your task is complete.
  // If you don't do this, your app could be terminated and/or assigned
  // battery-blame for consuming too much time in background.
  BackgroundFetch.finish(taskId);
};

// Register your BackgroundFetch HeadlessTask
BackgroundFetch.registerHeadlessTask(MyHeadlessTask);

AppRegistry.registerComponent(appName, () => App);
