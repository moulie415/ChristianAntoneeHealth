import {PurchasesEntitlementInfo} from 'react-native-purchases';
import {Area, Equipment} from './QuickRoutines';
import {Goal, Level} from './Shared';

export type Gender = 'male' | 'female' | 'none';

export type Unit = 'metric' | 'imperial';

export type StressLevel = 'low' | 'medium' | 'high';

export enum SleepPattern {
  FIVE = 'FIVE',
  FIVE_SIX = 'FIVE_SIX',
  SEVEN_EIGHT = 'SEVEN_EIGHT',
  EIGHT = 'EIGHT',
}

export enum TrainingAvailability {
  ONE_TWO = 'ONE_TWO',
  TWO_THREE = 'TWO_THREE',
  THREE_FOUR = 'THREE_FOUR',
  FOUR_PLUS = 'FOUR_PLUS',
}

export enum Sleep {
  LESS_THAN_FOUR = 'LESS_THAN_FOUR',
  BETWEEN_FOUR_AND_SEVEN = 'BETWEEN_FOUR_AND_SEVEN',
  MORE_THAN_SEVEN = 'MORE_THAN_SEVEN',
}

export enum DietaryPreference {
  VEGETARIAN = 'VEGETARIAN',
  VEGAN = 'VEGAN',
  INTERMITTENT_FASTING = 'INTERMITTENT_FASTING',
  KETOGENIC = 'KETOGENIC',
  PALEO = 'PALEO',
  GLUTEN_FREE = 'GLUTEN_FREE',
}

export enum CurrentExercise {
  THREE_FOUR_WEEK = 'THREE_FOUR_WEEK',
  ONE_TWO_WEEK = 'ONE_TWO_WEEK',
  ONE_TWO_MONTH = 'ONE_TWO_MONTH',
  NOT_AT_ALL = 'NOT_AT_ALL',
}

export type Premium =
  | undefined
  | false
  | {[key: string]: PurchasesEntitlementInfo};

export interface Targets {
  calories: number;
  mins: number;
  workouts: {
    level: Level;
    number: number;
  };
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
  targets?: Targets;
  marketing?: boolean;
  dob?: string;
  signedUp?: boolean;
  admin?: boolean;
  premium?: Premium;
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
  area?: Area;
  equipment?: Equipment;
  experience?: Level;
  favouriteRecipes?: string[];

  stressLevel?: StressLevel;
  sleep?: Sleep;
  dietaryPreference?: DietaryPreference | string;
  currentExercise?: CurrentExercise;
  fitnessRating?: number;
  heartCondition?: boolean;
  activityChestPain?: boolean;
  chestPain?: boolean;
  loseBalanceConsciousness?: boolean;
  boneProblems?: boolean;
  drugPrescription?: boolean;
  otherReason?: boolean;
  willInformDoctor?: boolean;
};
