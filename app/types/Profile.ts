import {Goal, Purpose} from './Shared';

export type Gender = 'male' | 'female';

export type Unit = 'metric' | 'imperial';

export default interface Profile {
  email: string;
  uid: string;
  name?: string;
  avatar?: string;
  gender?: Gender;
  weight?: number;
  height?: number;
  purpose?: Purpose;
  unit?: Unit;
  workoutFrequency?: number;
  goals?: Goal[];
  dob?: string;
  signedUp?: boolean;
  admin?: boolean;
};
