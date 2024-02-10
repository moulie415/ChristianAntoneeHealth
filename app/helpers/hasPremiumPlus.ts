import {Premium} from '../types/Profile';
import isTestFlight from './isTestFlight';

export const PREMIUM_PLUS = 'Premium Plus';

export const hasPremiumPlus = (premium: Premium) => {
  return (premium && premium[PREMIUM_PLUS]) || isTestFlight();
};
