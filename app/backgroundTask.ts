import * as Sentry from '@sentry/react-native';
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import moment from 'moment';
import { store } from './App';
import * as api from './helpers/api';
import { getStepSamples } from './helpers/biometrics';
import { logError } from './helpers/error';

const BACKGROUND_TASK_IDENTIFIER = 'background-task';

TaskManager.defineTask(BACKGROUND_TASK_IDENTIFIER, async () => {
  try {
    const { profile } = store.getState().profile;

    const { premium, optedInToLeaderboards, dailySteps, weeklySteps } = profile;

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
          updatePayload = { ...updatePayload, dailySteps: steps };
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
          updatePayload = { ...updatePayload, weeklySteps: steps };
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
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
  return BackgroundTask.BackgroundTaskResult.Success;
});

BackgroundTask.registerTaskAsync(BACKGROUND_TASK_IDENTIFIER);
