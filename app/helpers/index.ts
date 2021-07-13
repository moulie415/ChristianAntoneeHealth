import moment from 'moment';
import PushNotification from 'react-native-push-notification';

export const truncate = (str: string, n: number) => {
  if (!str) {
    return '';
  }
  return str.length > n ? str.substr(0, n - 1) + '...' : str;
};

export const scheduleLocalNotification = (
  message: string,
  date: Date,
  id: number,
  channel: string,
) => {
  const NOTIFICATION_DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';

  //schedule the notification
  try {
    PushNotification.localNotificationSchedule({
      message,
      date,
      id,
      repeatType: 'day',
      channelId: channel,
    });
  } catch (e) {
    console.log(e.message);
  }
};
