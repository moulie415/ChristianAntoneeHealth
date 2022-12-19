import {Goal, Level} from './Shared';

export type Gender = 'male' | 'female';

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

export enum PlanStatus {
  UNINITIALIZED = 1,
  PENDING = 2,
  COMPLETE = 3,
}

export default interface Profile {
  email: string;
  uid: string;
  planStatus?: PlanStatus;
  name?: string;
  surname?: string;
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
  stressLevel?: StressLevel;
  equipment?: string;
  trainingAvailability?: TrainingAvailability;
  usedFreePlan?: boolean;
  experience?: Level;
  medications?: string;
  nutrition?: string[];
  injuries?: string;
  occupation?: string;
  lifestyle?: string;
  bodyFatPercentage?: number;
  muscleMass?: number;
  boneMass?: number;
}
