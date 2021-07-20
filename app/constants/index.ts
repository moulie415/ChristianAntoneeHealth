import {Purpose} from '../types/Shared';

export interface PurposeItem {
  title: string;
  purpose: Purpose;
}

export const purposeItems: PurposeItem[] = [
  {title: 'Increase exercise and activity', purpose: Purpose.EXERCISE},
  {title: 'Burn calories', purpose: Purpose.CALORIES},
  {title: 'Improve fitness', purpose: Purpose.FITNESS},
];
