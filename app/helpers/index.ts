import PushNotification from 'react-native-push-notification';
import moment from 'moment';

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
  repeatType = 'day',
) => {
  try {
    const fixedDate = moment().isBefore(date)
      ? date
      : new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + 1,
          date.getMinutes(),
          0,
          0,
        );
    PushNotification.localNotificationSchedule({
      message,
      date: fixedDate,
      id,
      // @ts-ignore
      repeatType,
      channelId: channel,
    });
  } catch (e) {
    console.log(e.message);
  }
};
