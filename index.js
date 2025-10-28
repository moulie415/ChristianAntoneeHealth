//import './wdyr';
// import PushNotificationIOS from '@react-native-community/push-notification-ios';
// import messaging from '@react-native-firebase/messaging';
// // import * as Sentry from '@sentry/react-native';
// import moment from 'moment';
// import {AppRegistry, Linking, Platform} from 'react-native';
// import BackgroundFetch from 'react-native-background-fetch';
// @TODO re-enable background fetch and push notifications with expo-background-task and expo-notifications
// import PushNotification from 'react-native-push-notification';
import App/*, {store} */ from './app/App';
// import {navigate, navigationRef} from './app/RootNavigation';
// import * as api from './app/helpers/api';
// import {getStepSamples} from './app/helpers/biometrics';
// import {logError} from './app/helpers/error';
// import {setUnread} from './app/reducers/profile';
// import {
//   CONNECTION_ID,
//   MESSAGE_CHANNEL_ID,
//   MONTHLY_TEST_REMINDERS_CHANNEL_ID,
//   PLAN_CHANNEL_ID,
//   WORKOUT_REMINDERS_CHANNEL_ID,
// } from './app/sagas/profile';
import { registerRootComponent } from 'expo';

// let MyHeadlessTask = async event => {
//   // Get task id from event {}:
//   let taskId = event.taskId;
//   let isTimeout = event.timeout; // <-- true when your background-time has expired.
//   if (isTimeout) {
//     // This task has exceeded its allowed running-time.
//     // You must stop what you're doing immediately finish(taskId)
//     console.log('[BackgroundFetch] Headless TIMEOUT:', taskId);
//     logError(new Error('Task timed out'));
//     BackgroundFetch.finish(taskId);
//     return;
//   }
//   console.log('[BackgroundFetch HeadlessTask] start: ', taskId);
//   try {
//     const {profile} = store.getState().profile;

//     const {premium, optedInToLeaderboards, dailySteps, weeklySteps} = profile;

//     let updatePayload = {};

//     if (premium && optedInToLeaderboards) {
//       Sentry.addBreadcrumb({
//         message: 'User opted into leaderboards, now fetching samples...',
//         level: 'info',
//       });

//       const dailyStepsSamples = await getStepSamples();

//       if (dailyStepsSamples) {
//         const steps = dailyStepsSamples.reduce(
//           (acc, cur) => acc + cur.value,
//           0,
//         );

//         if (steps !== dailySteps) {
//           updatePayload = {...updatePayload, dailySteps: steps};
//         }
//       }

//       Sentry.addBreadcrumb({
//         message: 'User daily steps fetched',
//         data: updatePayload,
//         level: 'info',
//       });

//       const weeklyStepsSamples = await getStepSamples(
//         moment().utc().startOf('isoWeek').toDate(),
//         moment().utc().endOf('day').toDate(),
//       );
//       if (weeklyStepsSamples) {
//         const steps = weeklyStepsSamples.reduce(
//           (acc, cur) => acc + cur.value,
//           0,
//         );

//         if (steps !== weeklySteps) {
//           updatePayload = {...updatePayload, weeklySteps: steps};
//         }
//       }

//       Sentry.addBreadcrumb({
//         message: 'User weekly steps fetched',
//         data: updatePayload,
//         level: 'info',
//       });

//       if (Object.values(updatePayload).length > 0) {
//         // do this check to avoid updating steps when on simulator
//         if (!__DEV__) {
//           Sentry.addBreadcrumb({
//             message: 'Update payload has items, updating user...',
//             data: updatePayload,
//             level: 'info',
//           });
//           await api.updateUser(updatePayload, profile.uid);
//         }
//       }
//     }
//   } catch (e) {
//     logError(e);
//   }

//   // Required:  Signal to native code that your task is complete.
//   // If you don't do this, your app could be terminated and/or assigned
//   // battery-blame for consuming too much time in background.
//   BackgroundFetch.finish(taskId);
// };

// // Register your BackgroundFetch HeadlessTask
// BackgroundFetch.registerHeadlessTask(MyHeadlessTask);

// PushNotification.configure({
//   // (optional) Called when Token is generated (iOS and Android)
//   onRegister: ({token}) => {
//     if (token) {
//       messaging().setAPNSToken(token);
//     }
//   },

//   // (required) Called when a remote or local notification is opened or received
//   onNotification: notification => {
//     console.log('NOTIFICATION:', notification);

//     let shouldShowNotification = true;

//     const {unread, premium} = store.getState().profile.profile;
//     if (notification.userInteraction) {
//       if (notification.data.url) {
//         Linking.openURL(notification.data.url);
//       }
//       if (
//         (notification.channelId === WORKOUT_REMINDERS_CHANNEL_ID ||
//           notification.channelId === MONTHLY_TEST_REMINDERS_CHANNEL_ID ||
//           notification.data.channelId === PLAN_CHANNEL_ID) &&
//         navigationRef.current
//       ) {
//         const route = navigationRef.current.getCurrentRoute();
//         if (route.name === 'Plan') {
//           shouldShowNotification = false;
//         } else if (premium) {
//           navigate('Plan');
//         } else {
//           navigate('Premium', {});
//         }
//       }

//       if (
//         (notification.data.channelId === CONNECTION_ID ||
//           notification.data.channelId === MESSAGE_CHANNEL_ID) &&
//         navigationRef.current
//       ) {
//         if (premium) {
//           if (
//             notification.data.channelId === MESSAGE_CHANNEL_ID &&
//             notification.data.uid
//           ) {
//             navigate('Chat', {uid: notification.data.uid});
//           } else {
//             navigate('Connections');
//           }
//         } else {
//           navigate('Premium', {});
//         }
//       }
//     } else if (notification.foreground) {
//       if (notification.data.channelId === MESSAGE_CHANNEL_ID) {
//         if (
//           navigationRef.current &&
//           store.getState().profile.state === 'active'
//         ) {
//           const route = navigationRef.current.getCurrentRoute();
//           if (
//             route.name === 'Chat' &&
//             route.params?.uid === notification.data.uid
//           ) {
//             shouldShowNotification = false;
//           }
//         }
//       }

//       if (shouldShowNotification) {
//         PushNotification.localNotification({
//           ...notification,
//           message: notification.message || '',
//           title: notification.title || '',
//         });
//       }
//     }

//     if (!notification.userInteraction && shouldShowNotification && premium) {
//       if (notification.data.channelId === MESSAGE_CHANNEL_ID) {
//         const {uid} = notification.data;
//         const newUnread = unread && unread[uid] ? unread[uid] + 1 : 1;
//         store.dispatch(setUnread({...unread, [uid]: newUnread}));
//       }

//       if (notification.data.channelId === PLAN_CHANNEL_ID) {
//         const newUnread = unread && unread.plan ? unread.plan + 1 : 1;
//         store.dispatch(setUnread({...unread, ['plan']: newUnread}));
//       }
//     }

//     // process the notification

//     // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
//     if (Platform.OS === 'ios') {
//       notification.finish(PushNotificationIOS.FetchResult.NoData);
//     }
//   },

//   // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
//   senderID: '48631950986',

//   // IOS ONLY (optional): default: all - Permissions to register.
//   permissions: {
//     alert: true,
//     badge: true,
//     sound: true,
//   },

//   // Should the initial notification be popped automatically
//   // default: true
//   popInitialNotification: true,

//   /**
//    * (optional) default: true
//    * - Specified if permissions (ios) and token (android and ios) will requested or not,
//    * - if not, you must
//    *  */
//   requestPermissions: true,
// });


registerRootComponent(App);