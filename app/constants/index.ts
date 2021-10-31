import {Platform} from 'react-native';
import {Purpose} from '../types/Shared';
import colors from './colors';

export interface PurposeItem {
  title: string;
  purpose: Purpose;
}

export const purposeItems: PurposeItem[] = [
  {title: 'Increase exercise and activity', purpose: Purpose.EXERCISE},
  {title: 'Burn calories', purpose: Purpose.CALORIES},
  {title: 'Improve fitness', purpose: Purpose.FITNESS},
];

export const weightChartConfig = {
  backgroundGradientFrom: 'transparent',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: 'transparent',
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => colors.appBlue,
  strokeWidth: 2, // optional, default 3
  useShadowColorFromDataset: false, // optional
  propsForBackgroundLines: {
    strokeWidth: 1,
  },
  barPercentage: 0.7,
};

export const STORE_LINK =
  Platform.OS === 'ios'
    ? 'https://apps.apple.com/us/app/health-and-movement/id1506679389'
    : 'https://play.google.com/store/apps/details?id=com.healthandmovement';

export const UNIT_ID_INTERSTITIAL = () => {
  if (__DEV__) {
    return 'ca-app-pub-3940256099942544/4411468910';
  }
  if (Platform.OS === 'ios') {
    return 'ca-app-pub-7885763333661292/9112335668';
  }
  return 'ca-app-pub-7885763333661292/2930070695';
};
