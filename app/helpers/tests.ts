import moment from 'moment';
import { Profile } from '../types/Shared';

export const calculateVO2Max = (
  profile: Profile,
  seconds: number,
  heartRate?: number,
) => {
  if (
    !profile.weight ||
    !profile.dob ||
    !profile.gender ||
    heartRate === undefined
  ) {
    return null;
  }
  // VO2 max = 132.853 - (0.0769 x W) - (0.3877 x A) + (6.315 x G) - (3.2649 x T) - (0.1565 x H)
  // W = your weight (in pounds)
  // A = your age (in years)
  // G = gender factor, G = 0 for female, 1 for male
  // T = time to it took you complete the 1-mile walk (in minutes)
  // H = number of heart beats in 10 seconds at the end of the 1-mile walk
  return (
    132.853 -
    /* convert weight in kg to lbs */
    0.0769 * (profile.weight * 2.20462) -
    0.3877 * moment().diff(profile.dob, 'years') +
    6.315 * (profile.gender === 'male' ? 1 : 0) -
    3.2649 * (seconds / 60) -
    0.1565 * heartRate
  );
};
