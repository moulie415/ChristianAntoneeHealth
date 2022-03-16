import {Goal} from './Shared';

export type Gender = 'male' | 'female';

export type Unit = 'metric' | 'imperial';

export enum SleepPattern {
  FIVE = 1,
  FIVE_SIX = 2,
  SEVEN_EIGHT = 3,
  EIGHT = 4,
}

export default interface Profile {
  email: string;
  uid: string;
  name?: string;
  avatar?: string;
  gender?: Gender;
  weight?: number;
  height?: number;
  goal?: Goal;
  unit?: Unit;
  marketing?: boolean;
  dob?: string;
  signedUp?: boolean;
  admin?: boolean;
  premium?: boolean;
  unread?: {[key: string]: number};
  sleepPattern?: SleepPattern;
}
