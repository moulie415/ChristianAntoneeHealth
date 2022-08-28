//import './wdyr';
import {AppRegistry, Platform} from 'react-native';
import App, {store} from './app/App';
import {name as appName} from './app.json';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {navigate, navigationRef} from './app/RootNavigation';
import {
  CONNECTION_ID,
  MESSAGE_CHANNEL_ID,
  MONTHLY_TEST_REMINDERS_CHANNEL_ID,
  PLAN_CHANNEL_ID,
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
      if (
        notification.channelId === WORKOUT_REMINDERS_CHANNEL_ID ||
        notification.channelId === MONTHLY_TEST_REMINDERS_CHANNEL_ID
      ) {
        navigate('Plan');
      }
    }
    if (notification.data.channelId === PLAN_CHANNEL_ID) {
      if (navigationRef.current && notification.userInteraction) {
        navigate('Plan');
      } else if (notification.foreground) {
        PushNotification.localNotification({
          ...notification,
          message: notification.message || '',
          title: notification.title || '',
        });
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
        PushNotification.localNotification({
          ...notification,
          message: notification.message || '',
          title: notification.title || '',
        });
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
        const handleMessageNotification = () => {
          PushNotification.localNotification({
            ...notification,
            message: notification.message || '',
            title: notification.title || '',
          });
          const {unread, premium} = store.getState().profile.profile;
          if (premium) {
            const {uid} = notification.data;
            const newUnread = unread && unread[uid] ? unread[uid] + 1 : 1;
            store.dispatch(setUnread({...unread, [uid]: newUnread}));
          }
        };
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
            handleMessageNotification();
          }
        } else {
          handleMessageNotification();
        }
      }
    }

    // process the notification

    // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
    if (Platform.OS === 'ios') {
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    }
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
