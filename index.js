//import './wdyr';
import {Alert, AppRegistry} from 'react-native';
import App, {store} from './app/App';
import {name as appName} from './app.json';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
//import Shake from '@shakebugs/react-native-shake';
import {navigate, navigationRef} from './app/RootNavigation';
import {
  CONNECTION_ID,
  MESSAGE_CHANNEL_ID,
  MONTHLY_TEST_REMINDERS_CHANNEL_ID,
  WORKOUT_REMINDERS_CHANNEL_ID,
} from './app/sagas/profile';
import {setUnread} from './app/actions/profile';
import {alertPremiumFeature} from './app/helpers/exercises';

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: token => {},

  // (required) Called when a remote or local notification is opened or received
  onNotification: notification => {
    console.log('NOTIFICATION:', notification);
    if (notification.userInteraction) {
      if (notification.channelId === WORKOUT_REMINDERS_CHANNEL_ID) {
        navigate('Workout');
      }
      if (notification.channelId === MONTHLY_TEST_REMINDERS_CHANNEL_ID) {
        navigate('Fitness');
      }
    }
    if (notification.data.channelId === CONNECTION_ID) {
      if (navigationRef.current && notification.userInteraction) {
        const premium = store.getState().profile.profile.premium;
        if (premium) {
          navigate('Connections');
        } else {
          alertPremiumFeature();
        }
      } else if (notification.foreground) {
        PushNotification.localNotification(notification);
      }
    }
    if (notification.data.channelId === MESSAGE_CHANNEL_ID) {
      if (navigationRef.current && notification.userInteraction) {
        const premium = store.getState().profile.profile.premium;
        if (premium) {
          navigate('Connections');
        } else {
          alertPremiumFeature();
        }
      } else if (notification.foreground) {
        if (
          navigationRef.current &&
          store.getState().profile.state === 'active'
        ) {
          const route = navigationRef.current.getCurrentRoute();
          if (
            !(
              route.name === 'Chat' &&
              route.params?.uid === notification.data.uid
            )
          ) {
            PushNotification.localNotification(notification);
            const {unread} = store.getState().profile.profile;
            const {uid} = notification.data;
            const newUnread = unread[uid] ? unread[uid] + 1 : 1;
            store.dispatch(setUnread({...unread, [uid]: newUnread}));
          }
        } else {
          PushNotification.localNotification(notification);
          const {unread} = store.getState().profile.profile;
          const {uid} = notification.data;
          const newUnread = unread[uid] ? unread[uid] + 1 : 1;
          store.dispatch(setUnread({...unread, [uid]: newUnread}));
        }
      }
    }

    // process the notification

    // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
  senderID: '48631950986',

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must
   *  */
  requestPermissions: true,
});

AppRegistry.registerComponent(appName, () => App);

// Shake.start(
//   '9omC5WlFxzpDL4MZ7eD67j0zbMD70fK8C03UdezX',
//   'deQnccqkNEQETAX3VPgNgA7QgmUY1mDTCmyR6kR4gdpEc5aXhVbCj2I',
// );
