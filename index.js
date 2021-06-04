import {AppRegistry} from 'react-native';
import App from './app/App';
import {name as appName} from './app.json';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import db from '@react-native-firebase/firestore';

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: token => {
    console.log('TOKEN:', token);
    // db().collection('users').doc(uid).update({FCMToken: token});
  },

  // (required) Called when a remote or local notification is opened or received
  onNotification: notification => {
    console.log('NOTIFICATION:', notification);

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
