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
  repeatType = 'day',
) => {
  try {
    PushNotification.localNotificationSchedule({
      message,
      date,
      id,
      // @ts-ignore
      repeatType,
      channelId: channel,
    });
  } catch (e) {
    console.log(e.message);
  }
};
