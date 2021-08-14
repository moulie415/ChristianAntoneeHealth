import PushNotification from 'react-native-push-notification';
import moment from 'moment';
import Rate, {AndroidMarket} from 'react-native-rate';
import analytics from '@react-native-firebase/analytics';
import Profile from '../types/Profile';
import {Sample} from '../types/Shared';

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
    PushNotification.cancelLocalNotifications({id: `${id}`});
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

export const getWeightItems = (
  profile: Profile,
  monthlyWeightSamples: Sample[],
) => {
  const labels = [];
  const data = [];
  let prevWeight;
  let lowest = profile.weight || 0;
  let highest = profile.weight || 0;
  for (let i = 6; i >= 0; i--) {
    const day = moment().subtract(i, 'days');
    const dayOfYear = day.dayOfYear();
    const sample =
      monthlyWeightSamples &&
      monthlyWeightSamples.find(
        s => moment(s.startDate).dayOfYear() === dayOfYear,
      )?.value;
    if (i === 6) {
      const weight = sample || profile.weight || 0;
      if (weight > highest) {
        highest = weight;
      }
      if (weight < lowest) {
        lowest = weight;
      }
      data.push(weight);
      prevWeight = weight;
    } else {
      const weight = sample ?? prevWeight;
      data.push(weight);
      if (weight > highest) {
        highest = weight;
      }
      if (weight < lowest) {
        lowest = weight;
      }
    }
    labels.push(day.format('dd'));
  }
  return {data, labels, minMax: [lowest - 5, highest + 5]};
};

export const rateApp = () => {
  Rate.rate(
    {
      AppleAppID: '1506679389',
      GooglePackageName: 'com.healthandmovement',
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: true,
      openAppStoreIfInAppFails: true,
    },
    success => {
      analytics().logEvent('user_rating', {success});
    },
  );
};
