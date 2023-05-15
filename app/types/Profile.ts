import {PurchasesEntitlementInfo} from 'react-native-purchases';
import {Goal, Level} from './Shared';

export type Gender = 'male' | 'female' | null;

export type Unit = 'metric' | 'imperial';

export type StressLevel = 'low' | 'medium' | 'high';

export enum SleepPattern {
  FIVE = 1,
  FIVE_SIX = 2,
  SEVEN_EIGHT = 3,
  EIGHT = 4,
}

export enum TrainingAvailability {
  ONE_TWO = 1,
  TWO_THREE = 2,
  THREE_FOUR = 3,
  FOUR_PLUS = 4,
}

export default interface Profile {
  email: string;
  uid: string;
  name?: string;
  surname?: string;
  avatar?: string;
  gender?: Gender;
  weight?: number;
  height?: number;
  goal?: Goal;
  marketing?: boolean;
  dob?: string;
  signedUp?: boolean;
  admin?: boolean;
  client?: boolean;
  premium?: false | {[key: string]: PurchasesEntitlementInfo};
  unread?: {[key: string]: number};

  bodyFatPercentage?: number;
  muscleMass?: number;
  boneMass?: number;
};
