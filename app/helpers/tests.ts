import moment from 'moment';
import Profile from '../types/Profile';

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
  return (
    132.853 -
    0.0769 * (profile.weight * 2.20462) /* convert weight in kg to lbs */ -
    0.3877 * moment().diff(profile.dob, 'years') +
    (profile.gender === 'male' ? 6.315 : 0) -
    3.2649 * (seconds / 60) -
    0.1565 * heartRate
  );
};
