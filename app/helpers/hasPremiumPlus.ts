import {Premium} from '../types/Profile';

export const PREMIUM_PLUS = 'Premium Plus';

export const hasPremiumPlus = (premium: Premium) => {
  return premium && premium[PREMIUM_PLUS];
};
