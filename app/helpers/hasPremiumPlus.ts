import { Premium } from '../types/Shared';

export const PREMIUM_PLUS = 'Premium Plus';

export const hasPremiumPlus = (premium: Premium) => {
  return premium && premium[PREMIUM_PLUS];
};
