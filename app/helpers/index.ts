import PushNotification from 'react-native-push-notification';
import moment from 'moment';
import {Dimensions} from 'react-native';
import Rate, {AndroidMarket} from 'react-native-rate';
import analytics from '@react-native-firebase/analytics';
import Profile from '../types/Profile';
import {Sample} from '../types/Shared';
import colors from '../constants/colors';
import {PercentileTable, Table} from '../types/Test';
import {Category} from '../types/Education';

const {height, width} = Dimensions.get('window');

export const truncate = (str: string, n: number) => {
  if (!str) {
    return '';
  }
  return str.length > n ? str.substr(0, n - 1) + '...' : str;
};

export const scheduleLocalNotification = (
  message: string,
  date: Date,
  id: string,
  channel: string,
  repeatType = 'day',
) => {
  try {
    const fixedDate = moment().isBefore(date)
      ? moment(date).set('seconds', 0).subtract(1, 'day').utc().toDate()
      : moment(date).set('seconds', 0).utc().toDate();

    PushNotification.cancelLocalNotification(`${id}`);
    PushNotification.localNotificationSchedule({
      message,
      date: fixedDate,
      // @ts-ignore
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

export const getVideoHeight = () => {
  const screenRatio = height / width;
  return height / screenRatio;
};

export const quickRoutineTabString = (
  tab: number,
  key: 'area' | 'focus' | 'equipment',
) => {
  if (tab === 1) {
    if (key === 'area') {
      return 'Upper Body';
    }
    if (key === 'focus') {
      return 'Bone density';
    }
    if (key === 'equipment') {
      return 'Full Equipment';
    }
  }
  if (tab === 2) {
    if (key === 'area') {
      return 'Lower Body';
    }
    if (key === 'focus') {
      return 'Weight';
    }
    if (key === 'equipment') {
      return 'Minimal equipment';
    }
  }
  if (tab === 3) {
    if (key === 'area') {
      return 'Full body';
    }
    if (key === 'focus') {
      return 'Core and lower back';
    }
    if (key === 'equipment') {
      return 'No equipment';
    }
  }
  if (key === 'area') {
    return 'Abs and core';
  }
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getScoreIcon = (category: string) => {
  switch (category) {
    case 'excellent':
    case 'good':
    case 'aboveAverage':
    case '90th':
    case '80th':
    case '70th':
      return 'arrow-up';
    case 'average':
    case '60th':
    case '50th':
    case '40th':
      return '-';
    default:
      return 'arrow-down';
  }
};

export const getCategoryString = (category: string) => {
  if (category === 'aboveAverage') {
    return 'Above average';
  }
  if (category === 'belowAverage') {
    return 'Below Average';
  }
  if (category === 'veryPoor') {
    return 'Very poor';
  }
  return capitalizeFirstLetter(category);
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'excellent':
    case 'good':
    case 'aboveAverage':
    case '90th':
    case '80th':
    case '70th':
      return colors.appGreen;
    case 'average':
    case '60th':
    case '50th':
    case '40th':
      return colors.appBlue;
    default:
      return colors.appRed;
  }
};

export const getTableColumn = (table: Table, age: number) => {
  return (
    table &&
    Object.keys(table.age).find(c => {
      // @ts-ignore
      const values: Cell = table.age[c];
      if (
        (!values.higher || age <= Number(values.higher)) &&
        (!values.lower || age >= Number(values.lower))
      ) {
        return c;
      }
    })
  );
};

export const getTableCategory = (table: Table, col: string, score: number) => {
  return Object.keys(table).find(key => {
    if (key !== 'age') {
      // @ts-ignore
      const values: Cell = table[key][col];
      if (
        (!values.higher || score <= Number(values.higher)) &&
        (!values.lower || score >= Number(values.lower))
      ) {
        return key;
      }
    }
  });
};

export const getTableMax = (table: Table, col: string) => {
  let max = 0;
  Object.keys(table).forEach(key => {
    if (key !== 'age') {
      // @ts-ignore
      const values: Cell = table[key][col];
      if (values.higher && Number(values.higher) > max) {
        max = Number(values.higher);
      } else if (values.lower && Number(values.lower) > max) {
        max = Number(values.lower);
      }
    }
  });
  return max;
};

export const getTableAverage = (table: Table, col: string) => {
  // @ts-ignore
  return table.average[col];
};

export const getPercentile = (table: PercentileTable, score: number) => {
  let prevPercentile = 'bottom';
  for (let i = 1; i < 10; i++) {
    const percentile = `${i}0th`;
    // @ts-ignore
    const val = table[percentile];
    if (score < val) {
      return prevPercentile;
    }
    if (percentile === '90th') {
      return '90th';
    }
    prevPercentile = percentile;
  }
};

export const getPercentileFill = (percentile: string) => {
  switch (percentile) {
    case '90th':
      return 100;
    case '80th':
      return 90;
    case '70th':
      return 80;
    case '60th':
      return 70;
    case '50th':
      return 60;
    case '40th':
      return 50;
    case '30th':
      return 40;
    case '20th':
      return 30;
    case '10th':
      return 20;
    default:
      return 10;
  }
};

export const getEducationCategoryString = (category: Category) => {
  switch (category) {
    case Category.EXERCISE:
      return 'Education Articles';
    case Category.NUTRITIONAL:
      return 'Nutritional Info';
    default:
      return 'General Lifestyle';
  }
};
