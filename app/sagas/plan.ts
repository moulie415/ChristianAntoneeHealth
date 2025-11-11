import * as _ from 'lodash';
import Snackbar from 'react-native-snackbar';
import { eventChannel, EventChannel } from 'redux-saga';
import {
  all,
  call,
  fork,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';

import notifee, { TriggerType } from '@notifee/react-native';
import db from '@react-native-firebase/firestore';
import { PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';
import RNCalendarEvents, {
  CalendarEventWritable,
} from 'react-native-calendar-events';
import { RootState } from '../App';
import { logError } from '../helpers/error';
import {
  GET_PLAN,
  ProfileState,
  setPlan,
  setSyncedPlanEvent,
  SYNC_PLAN_WITH_CALENDAR,
  syncPlanWithCalendar,
  UPDATE_PROFILE,
  updateProfile,
} from '../reducers/profile';
import { Plan } from '../types/Shared';
import {
  scheduleGoalReminderNotification,
  WORKOUT_REMINDERS_CHANNEL_ID,
} from './profile';
function* syncPlanWithCalendarWorker(
  action: PayloadAction<{ plan: Plan; sync: boolean }>,
) {
  try {
    const { plan, sync } = action.payload;
    if (sync) {
      const { calendarId } = yield select((state: RootState) => state.profile);
      if (!calendarId) {
        throw new Error('No valid calendar found');
      }
      const events: {
        title: string;
        details: CalendarEventWritable;
      }[] = [];

      const keys: string[] = [];

      const { syncedPlanEvents, profile }: ProfileState = yield select(
        (state: RootState) => state.profile,
      );

      plan?.workouts?.forEach(workout => {
        workout.dates?.forEach(date => {
          const title = workout.name || 'CA Health Workout';
          const key = `${plan.id}${title}${date}`;
          const currentId = syncedPlanEvents[key];
          const event: {
            title: string;
            details: CalendarEventWritable;
          } = {
            title,
            details: {
              ...(currentId ? { id: currentId } : {}),
              startDate: moment(date)
                .set('hours', moment(profile.workoutReminderTime).hours())
                .set('minutes', moment(profile.workoutReminderTime).minutes())
                .toISOString(),
              endDate: moment(date)
                .set('hours', moment(profile.workoutReminderTime).hours())
                .set('minutes', moment(profile.workoutReminderTime).minutes())
                .add(1, 'hour')
                .toISOString(),
              calendarId,
            },
          };
          events.push(event);
          keys.push(key);
        });
      });

      for (let i = 0; i < events.length; i++) {
        const key = keys[i];
        const event = events[i];
        let id: string;
        try {
          id = yield call(
            RNCalendarEvents.saveEvent,
            event.title,
            event.details,
          );
        } catch (e) {
          id = yield call(
            RNCalendarEvents.saveEvent,
            event.title,
            _.omit(event.details, ['id']),
          );
        }
        yield put(setSyncedPlanEvent({ key, id }));
      }
    }
  } catch (e) {
    logError(e);
    Snackbar.show({ text: 'Error syncing calendar' });
    yield put(updateProfile({ syncPlanWithCalendar: false }));
  }
}

export function* schedulePlanReminders() {
  notifee.cancelAllNotifications();
  const plan: Plan | undefined = yield select(
    (state: RootState) => state.profile.plan,
  );
  const { calendarId, profile }: ProfileState = yield select(
    (state: RootState) => state.profile,
  );
  if (plan) {
    if (plan.workouts && profile.workoutReminders) {
      plan.workouts.forEach(workout => {
        workout.dates.forEach(d => {
          const date = moment(d)
            .set('hours', moment(profile.workoutReminderTime).hours())
            .set('minutes', moment(profile.workoutReminderTime).minutes());
          if (date.isAfter(moment())) {
            notifee.createTriggerNotification(
              {
                body: 'Reminder to do your workout for today',
                android: {
                  channelId: WORKOUT_REMINDERS_CHANNEL_ID,
                },
              },
              {
                type: TriggerType.TIMESTAMP,
                timestamp: date.milliseconds(),
              },
            );
          }
        });
      });
    }

    if (profile.syncPlanWithCalendar && calendarId) {
      const p = plan as Plan;
      yield put(
        syncPlanWithCalendar({ plan: p, sync: profile.syncPlanWithCalendar }),
      );
    }

    // if (plan.tests && testReminders) {
    //   plan.tests.forEach(test => {
    //     test.dates.forEach(d => {
    //       const date = moment(d)
    //         .set('hours', moment(testReminderTime).hours())
    //         .set('minutes', moment(testReminderTime).minutes());
    //       if (date.isAfter(moment())) {
    //         scheduleLocalNotification(
    //           'Reminder to do your fitness test for today',
    //           date.toDate(),
    //           TEST_REMINDERS_CHANNEL_ID,
    //         );
    //       }
    //     });
    //   });
    // }
  }
  yield call(scheduleGoalReminderNotification);
}

function onPlanChanged(uid: string) {
  return eventChannel(emitter => {
    const subscriber = db()
      .collection('plans')
      .where('user', '==', uid)
      .orderBy('createdate')
      .limitToLast(100)
      .onSnapshot(
        snapshot => {
          // check for plan that has workouts  either today
          // or before and after today and make it the current plan
          let doc = snapshot.docs?.find(d => {
            const plan = d.data() as Plan;
            return plan?.workouts?.some(workout => {
              return (
                workout.dates?.some(date =>
                  moment(date).isSameOrAfter(moment(), 'day'),
                ) &&
                workout.dates?.some(date =>
                  moment(date).isSameOrBefore(moment(), 'day'),
                )
              );
            });
          });

          // if we haven't found the plan yet make it a plan with
          // workouts in the future but the workouts that are soonest to occur

          if (!doc) {
            const filtered = snapshot.docs?.filter(d => {
              const plan = d.data() as Plan;
              return plan?.workouts?.some(workout => {
                return workout.dates?.some(date =>
                  moment(date).isSameOrAfter(moment(), 'day'),
                );
              });
            });

            filtered.forEach(d => {
              const current = d.data() as Plan;
              let earliestDate = current.workouts[0]?.dates?.[0];
              current.workouts.forEach(workout => {
                workout.dates.forEach(date => {
                  if (moment(date).isBefore(moment(earliestDate))) {
                    earliestDate = date;
                    doc = d;
                  }
                });
              });
            });
          }

          // if we still haven't found one just make it the latest plan to be created
          if (!doc) {
            const sorted = snapshot.docs.sort((a, b) => {
              return (
                moment(b.data().createdate?.toDate()).unix() -
                moment(a.data().createdate?.toDate()).unix()
              );
            });
            doc = sorted[0];
          }
          if (doc) {
            emitter({
              ...doc.data(),
              id: doc.id,
              createdate: doc.data().createdate?.toDate(),
              lastupdate: doc.data().lastupdate?.toDate(),
            });
          } else {
            emitter({});
          }
        },
        error => {
          logError(error);
        },
      );
    return subscriber;
  });
}

function* planWatcher() {
  try {
    const { uid } = yield select((state: RootState) => state.profile.profile);

    const channel: EventChannel<Plan> = yield call(onPlanChanged, uid);

    while (true) {
      const plan: Plan | {} = yield take(channel);
      const current: Plan = yield select(
        (state: RootState) => state.profile.plan,
      );
      if (_.isEmpty(plan)) {
        yield put(setPlan(undefined));
      } else {
        if (
          current &&
          !_.isEqual(
            _.omit(current, ['lastupdate', 'createdate']),
            _.omit(plan, ['lastupdate', 'createdate']),
          )
        ) {
          Snackbar.show({ text: 'Your plan has been updated' });
        }
        yield put(setPlan(plan as Plan));
        const { syncPlanWithCalendar: sync, calendarId } = yield select(
          (state: RootState) => state.profile,
        );
        if (sync && calendarId) {
          const p = plan as Plan;
          yield put(syncPlanWithCalendar({ plan: p, sync }));
        }
      }
      yield call(schedulePlanReminders);
    }
  } catch (e) {
    logError(e);
  }
}

function* getPlanWorker() {
  try {
    yield fork(planWatcher);
  } catch (e) {
    logError(e);
  }
}

export default function* planSaga() {
  yield all([
    takeLatest(GET_PLAN, getPlanWorker),
    takeLatest(UPDATE_PROFILE, schedulePlanReminders),
    takeLatest(SYNC_PLAN_WITH_CALENDAR, syncPlanWithCalendarWorker),
  ]);
}
