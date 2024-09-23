import {Timestamp} from '@react-native-firebase/firestore';
import {PurchasesEntitlementInfo} from 'react-native-purchases';
import {Area, Equipment as EquipmentLevel} from './QuickRoutines';

export interface Targets {
  calories: number;
  mins: number;
  workouts: {
    level: Level;
    number: number;
  };
}

export type Premium =
  | undefined
  | false
  | {[key: string]: PurchasesEntitlementInfo};

export type Gender = 'male' | 'female' | 'none';

export type Unit = 'metric' | 'imperial';

export type StressLevel = 'low' | 'medium' | 'high';

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
  EVERYTHING = 'EVERYTHING',
}

export enum CurrentExercise {
  THREE_FOUR_WEEK = 'THREE_FOUR_WEEK',
  ONE_TWO_WEEK = 'ONE_TWO_WEEK',
  ONE_TWO_MONTH = 'ONE_TWO_MONTH',
  NOT_AT_ALL = 'NOT_AT_ALL',
}

export interface DeviceInfo {
  fontScale: number;
  buildNumber: string;
  version: string;
  brand: string;
  deviceId: string;
  deviceType: string;
  isTablet: boolean;
  os: string;
}

export interface Profile {
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
  visceralFat?: number;
  metabolicAge?: number;
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
  equipment?: EquipmentLevel;
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
  boneProblemsDescription?: string;
  drugPrescription?: boolean;
  otherReason?: boolean;
  otherReasonDescription?: string;
  willInformDoctor?: boolean;
  dailySteps?: number;
  dailyCalories?: number;
  weeklySteps?: number;
  weeklyCalories?: number;
  dailyWorkoutStreak?: number;
  lastWorkoutDate?: string;
  freeBiometrics?: boolean;
  hasLeftFeedback?: boolean;
  dontAskAgain?: boolean;
  deviceInfo?: DeviceInfo;
  optedInToLeaderboards?: boolean;
  client?: boolean;
}

export enum Level {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum Goal {
  STRENGTH = 'strength',
  WEIGHT_LOSS = 'weightLoss',
  ACTIVE = 'active',
  OTHER = 'other',
}

export enum WarmUp {
  CIRCULATORY = 'circulatory',
  SOFT_TISSUE = 'softTissue',
  DYNAMIC_STRETCHING = 'dynamicStretching',
}

export enum CoolDown {
  CIRCULATORY = 'circulatory',
  STATIC_STRETCHING = 'staticStretching',
}

export enum FlexibilityArea {
  SHOULDERS = 'shoulders',
  HIPS = 'hips',
  SPINE = 'spine',
}

export interface Sample {
  startDate: string;
  endDate: string;
  value: number;
}

export type CalorieCalculationType = 'sample' | 'heartRate' | 'estimate';

export interface StepSample {
  date: string;
  value: number;
}

export interface ExerciseEvent {
  value: number;
  time: Date | Timestamp;
}

export interface PauseEvent {
  paused: boolean;
  time: Date | Timestamp;
}

export enum Equipment {
  NONE = 'none',
  BARBELLS = 'barbells',
  DUMBBELLS = 'dumbbells',
  BENCHES = 'benches',
  CABLE_MACHINES = 'cableMachines',
  KETTLEBELLS = 'kettlebells',
  PULL_UP_BAR = 'pullUpBar',
  SQUAT_RACK = 'squatRack',
  EXERCISE_BALL = 'exerciseBall',
  BOSU_BALL = 'bosuBall',
  AGILITY_LADDER = 'agilityLadder',
  PLYOMETRIC_BOX = 'plyometricBox',
  TRX_SUSPENSION_TRAINER = 'trxSuspensionTrainer',
  MEDICINE_BALLS = 'medicineBalls',
  LANDMINE = 'landmine',
  EXERCISE_STEP = 'exerciseStep',
  FOAM_ROLLER = 'foamRoller',
}

export interface PlanExercise {
  exercise: string;
  prepTime?: number;
  weight?: string;
  notes?: string;
  time?: number;
}

export interface PlanWorkout {
  name: string;
  steps?: string[];
  dates: string[];
  exercises: PlanExercise[];
  today?: boolean;
  level: Level;
  disableWorkoutMusic: boolean;
}

export interface PlanNutrition {
  general: string;
  generalRecipes: string[];
}

export interface PlanSleep {
  general: string;
}

export interface Plan {
  id: string;
  user: string;
  workouts: PlanWorkout[];
  nutrition: PlanNutrition;
  sleep: PlanSleep;
  tests: string[];
  education: string[];
}

export interface CalendarType {
  /** Unique calendar ID. */
  id: string;
  /** The calendar’s title. */
  title: string;
  /** The calendar’s type. */
  type: string;
  /** The source object representing the account to which this calendar belongs. */
  source: string;
  /** Indicates if the calendar is assigned as primary. */
  isPrimary: boolean;
  /** Indicates if the calendar allows events to be written, edited or removed. */
  allowsModifications: boolean;
  /** The color assigned to the calendar represented as a hex value. */
  color: string;
  /** The event availability settings supported by the calendar. */
  allowedAvailabilities: string[];
}

export interface SignUpPayload {
  name: string;
  surname: string;
  dob: string;
  weight: number;
  height: number;
  gender: Gender;
  marketing: boolean;
  goal: Goal;
  area: Area;
  equipment: EquipmentLevel;
  experience: Level;
  stressLevel: StressLevel;
  sleep: Sleep;
  dietaryPreference: DietaryPreference | string;
  currentExercise: CurrentExercise;
  fitnessRating: number;
  fromProfile?: boolean;
  client: boolean;
}

export interface UpdateProfilePayload {
  dob?: string;
  weight?: number;
  height?: number;
  gender?: Gender;
  marketing?: boolean;
  goal?: Goal;
  avatar?: string;
  bodyFatPercentage?: number;
  muscleMass?: number;
  boneMass?: number;
  workoutReminders?: boolean;
  workoutReminderTime?: string;
  testReminderTime?: string;
  testReminders?: boolean;
  autoPlay?: boolean;
  prepTime?: number;
  workoutMusic?: boolean;
  syncPlanWithCalendar?: boolean;
  goalReminders?: boolean;
  favouriteRecipes?: string[];
  dailyWorkoutStreak?: number;
  lastWorkoutDate?: string;
  disableSnackbar?: boolean;
  dontAskAgain?: boolean;
  hasLeftFeedback?: boolean;
  optedInToLeaderboards?: boolean;
  dailySteps?: number;
  dailyCalories?: number;
  weeklySteps?: number;
  weeklyCalories?: number;
}

export interface Recipe {
  id: string;
  name: string;
  category: RecipeCategory;
  image: {title: string; src: string};
  recipe: {title: string; src: string};
  premium: boolean;
}

export enum RecipeCategory {
  HIGH_PROTEIN = 'highProtein',
  VEGETARIAN = 'vegetarian',
  VEGAN = 'vegan',
  LOW_CARB = 'lowCarb',
  SMOOTHIE = 'smoothie',
  FIVE_INGREDIENT = 'fiveIngredient',
  GLUTEN_FREE = 'glutenFree',
}

export interface WatchWorkoutResponse {
  energySamples: Sample[];
  heartRateSamples: Sample[];
}

export type LeaderboardType =
  | 'dailySteps'
  | 'weeklySteps'
  | 'dailyCalories'
  | 'weeklyCalories'
  | 'workoutStreak';

export interface LeaderboardItem {
  score: number;
  userId: string;
  rank: number;
  timestamp: Timestamp;
  user?: Partial<Profile>;
}

export type Leaderboard = LeaderboardItem[];
