import {Platform} from 'react-native';
import {Goal} from '../types/Shared';
import colors from './colors';

export interface GoalItem {
  title: string;
  goal: Goal;
}

export const goalItems: GoalItem[] = [
  {title: 'Improve my strength', goal: Goal.STRENGTH},
  {title: 'Improve my fitness', goal: Goal.FITNESS},
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

const getInterstitialId = () => {
  if (__DEV__) {
    return 'ca-app-pub-3940256099942544/4411468910';
  }
  if (Platform.OS === 'ios') {
    return 'ca-app-pub-7885763333661292/9112335668';
  }
  return 'ca-app-pub-7885763333661292/2930070695';
};

export const UNIT_ID_INTERSTITIAL = getInterstitialId();

export const AD_KEYWORDS = ['fitness', 'gym', 'health'];
