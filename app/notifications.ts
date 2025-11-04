import * as Notifications from 'expo-notifications';
import { Linking } from 'react-native';
import { store } from './App';
import { navigate, navigationRef } from './RootNavigation';
import { setUnread } from './reducers/profile';
import {
  CONNECTION_ID,
  MESSAGE_CHANNEL_ID,
  PLAN_CHANNEL_ID,
  WORKOUT_REMINDERS_CHANNEL_ID,
} from './sagas/profile';

Notifications.setNotificationHandler({
  handleNotification: async notification => {
    console.log('NOTIFICATION:', notification);
    let shouldShowNotification = true;
    const { unread, premium } = store.getState().profile.profile;
    if (notification.userInteraction) {
      if (notification.data.url) {
        Linking.openURL(notification.data.url);
      }
      if (
        (notification.channelId === WORKOUT_REMINDERS_CHANNEL_ID ||
          notification.data.channelId === PLAN_CHANNEL_ID) &&
        navigationRef.current
      ) {
        const route = navigationRef.current.getCurrentRoute();
        if (route.name === 'Plan') {
          shouldShowNotification = false;
        } else if (premium) {
          navigate('Plan');
        } else {
          navigate('Premium', {});
        }
      }
      if (
        (notification.data.channelId === CONNECTION_ID ||
          notification.data.channelId === MESSAGE_CHANNEL_ID) &&
        navigationRef.current
      ) {
        if (premium) {
          if (
            notification.data.channelId === MESSAGE_CHANNEL_ID &&
            notification.data.uid
          ) {
            navigate('Chat', { uid: notification.data.uid });
          } else {
            navigate('Connections');
          }
        } else {
          navigate('Premium', {});
        }
      }
    } else if (notification.foreground) {
      if (notification.data.channelId === MESSAGE_CHANNEL_ID) {
        if (
          navigationRef.current &&
          store.getState().profile.state === 'active'
        ) {
          const route = navigationRef.current.getCurrentRoute();
          if (
            route.name === 'Chat' &&
            route.params?.uid === notification.data.uid
          ) {
            shouldShowNotification = false;
          }
        }
      }
    }
    if (!notification.userInteraction && shouldShowNotification && premium) {
      if (notification.data.channelId === MESSAGE_CHANNEL_ID) {
        const { uid } = notification.data;
        const newUnread = unread && unread[uid] ? unread[uid] + 1 : 1;
        store.dispatch(setUnread({ ...unread, [uid]: newUnread }));
      }
      if (notification.data.channelId === PLAN_CHANNEL_ID) {
        const newUnread = unread && unread.plan ? unread.plan + 1 : 1;
        store.dispatch(setUnread({ ...unread, ['plan']: newUnread }));
      }
    }
    // TODO revisit what you want to do with this
    return {
      shouldShowAlert: shouldShowNotification,
      shouldPlaySound: shouldShowNotification,
      shouldSetBadge: shouldShowNotification,
      shouldShowBanner: shouldShowNotification,
      shouldShowList: shouldShowNotification,
    };
  },
});
