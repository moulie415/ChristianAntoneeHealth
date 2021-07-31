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
