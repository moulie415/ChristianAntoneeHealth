import {Goal} from './Shared';

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
  goal?: Goal;
  unit?: Unit;
  dob?: string;
  signedUp?: boolean;
  admin?: boolean;
  premium?: boolean;
  unread?: {[key: string]: number};
}
