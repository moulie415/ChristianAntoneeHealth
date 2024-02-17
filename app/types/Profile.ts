import {PurchasesEntitlementInfo} from 'react-native-purchases';
import {Area, Equipment} from './QuickRoutines';
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

export enum Sleep {
  LESS_THAN_FOUR,
  BETWEEN_FOUR_AND_SEVEN,
  MORE_THAN_SEVEN,
}

export enum DietaryPreference {
  VEGETARIAN,
  VEGAN,
  INTERMITTENT_FASTING,
  KETOGENIC,
  PALEO,
  GLUTEN_FREE,
}

export enum CurrentExercise {
  THREE_FOUR_WEEK,
  ONE_TWO_WEEK,
  ONE_TWO_MONTH,
  NOT_AT_ALL,
}

export type Premium =
  | undefined
  | false
  | {[key: string]: PurchasesEntitlementInfo};

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
