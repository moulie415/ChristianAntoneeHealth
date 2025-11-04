import * as Notifications from 'expo-notifications';
import { Linking } from 'react-native';
import { store } from './App';
import { navigate, navigationRef } from './RootNavigation';
import { logError } from './helpers/error';
import { setUnread } from './reducers/profile';
import {
  CONNECTION_ID,
  MESSAGE_CHANNEL_ID,
  PLAN_CHANNEL_ID,
  WORKOUT_REMINDERS_CHANNEL_ID,
} from './sagas/profile';

Notifications.setNotificationHandler({
  handleNotification: async notification => {
    const { data } = notification.request.content;
    const { unread, premium } = store.getState().profile.profile;
    let shouldShowNotification = true;

    if (notification.request.content.data.channelId === MESSAGE_CHANNEL_ID) {
      const route = navigationRef.current?.getCurrentRoute();
      if (route?.name === 'Chat' && route.params?.uid === data.uid) {
        shouldShowNotification = false;
      }
    }

    if (shouldShowNotification && premium) {
      if (data.channelId === MESSAGE_CHANNEL_ID) {
        const uid = data.uid as string;
        const newUnread = unread && unread[uid] ? unread[uid] + 1 : 1;
        store.dispatch(setUnread({ ...unread, [uid]: newUnread }));
      }
      if (data.channelId === PLAN_CHANNEL_ID) {
        const newUnread = unread?.plan ? unread.plan + 1 : 1;
        store.dispatch(setUnread({ ...unread, plan: newUnread }));
      }
    }

    return {
      shouldShowAlert: shouldShowNotification,
      shouldPlaySound: shouldShowNotification,
      shouldSetBadge: shouldShowNotification,
      shouldShowBanner: shouldShowNotification,
      shouldShowList: shouldShowNotification,
    };
  },
});

Notifications.addNotificationResponseReceivedListener(response => {
  try {
    const { data } = response.notification.request.content;
    const { premium } = store.getState().profile.profile;
    const channelId = data.channelId as string;
    if (data.url) {
      Linking.openURL(data.url as string);
      return;
    }

    if (
      [WORKOUT_REMINDERS_CHANNEL_ID, PLAN_CHANNEL_ID].includes(channelId) &&
      navigationRef.current
    ) {
      const route = navigationRef.current.getCurrentRoute();
      if (route?.name === 'Plan') return;
      if (premium) navigate('Plan');
      else navigate('Premium', {});
      return;
    }

    if (
      [CONNECTION_ID, MESSAGE_CHANNEL_ID].includes(channelId) &&
      navigationRef.current
    ) {
      if (premium) {
        if (data.channelId === MESSAGE_CHANNEL_ID && data.uid) {
          navigate('Chat', { uid: data.uid });
        } else {
          navigate('Connections');
        }
      } else {
        navigate('Premium', {});
      }
    }
  } catch (e) {
    logError(e);
  }
});
