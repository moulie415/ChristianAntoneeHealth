import {Goal, Purpose} from './Shared';

export type Gender = 'male' | 'female';

export type WeightMetric = 'kg' | 'lbs';

export type HeightMetric = 'cm' | 'inches';

export default interface Profile {
  email: string;
  uid: string;
  name?: string;
  avatar?: string;
  gender?: Gender;
  weight?: number;
  height?: number;
  purpose?: Purpose;
  weightMetric?: WeightMetric;
  heightMetric?: HeightMetric;
  workoutFrequency?: number;
  goals?: Goal[];
  dob?: string;
  signedUp?: boolean;
  admin?: boolean;
};
