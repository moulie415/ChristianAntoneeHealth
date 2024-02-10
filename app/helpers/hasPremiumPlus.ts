import {Premium} from '../types/Profile';

export const hasPremiumPlus = (premium: Premium) => {
  return premium && premium['Premium Plus'];
};
