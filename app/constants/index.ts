import {Platform} from 'react-native';
import {generateValues} from '../helpers/generateValues';
import {Goal} from '../types/Shared';

export interface GoalItem {
  title: string;
  goal: Goal;
}

export const goalItems: GoalItem[] = [
  {title: 'Improve my strength', goal: Goal.STRENGTH},
];

export const STORE_LINK =
  Platform.OS === 'ios'
    ? 'https://apps.apple.com/app/health-and-movement/id1506679389'
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

export const DECIMAL_PLACES = generateValues(0, 9, 1);
export const WEIGHTS = generateValues(0, 500, 1);
export const HEIGHTS = generateValues(0, 500, 1);
export const PERCENTAGES = generateValues(0, 100, 1);
export const MUSCLE_MASSES = generateValues(0, 100, 1);
export const BONE_DENSITIES = generateValues(0, 10, 1);
export const VISCERAL_FAT_VALUES = generateValues(0, 60, 1);
export const METABOLIC_AGE_VALUES = generateValues(0, 100, 1);
export const REPS = [...Array(101).keys()];
export const SETS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const FITNESS_RATINGS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const RESISTANCE = [...Array(301).keys()];
export const PREP_TIME_SECS = [...Array(61).keys()];

export const FONTS_SIZES = {
  SMALL: 12,
  MEDIUM_LARGE: 18,
  LARGE: 24,
};
