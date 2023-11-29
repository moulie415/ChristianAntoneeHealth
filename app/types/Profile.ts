import {PurchasesEntitlementInfo} from 'react-native-purchases';
import {Goal, Level} from './Shared';

export type Gender = 'male' | 'female' | 'none';

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
  premium?: false | {[key: string]: PurchasesEntitlementInfo};
  unread?: {[key: string]: number};

  bodyFatPercentage?: number;
  muscleMass?: number;
  boneMass?: number;
  garminAccessTokenSecret?: string;
  garminAccessToken?: string;
  polarAccessToken?: string;
  fitbitToken?: string;
  fitbitRefreshToken?: string;
  fitbitUserId?: string;
  fitbitTokenExpiresIn?: number;
  fitbitTokenTimestamp?: number;
  workoutReminders?: boolean;
  workoutReminderTime?: string;
  testReminderTime?: string;
  testReminders?: boolean;
  autoPlay?: boolean;
  prepTime?: number;
  workoutMusic?: boolean;
  syncPlanWithCalendar?: boolean;
  goalReminders?: boolean;
};
