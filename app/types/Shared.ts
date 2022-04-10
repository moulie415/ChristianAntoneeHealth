import {EducationState} from '../reducers/education';
import {ExercisesState} from '../reducers/exercises';
import {ProfileState} from '../reducers/profile';
import {QuickRoutinesState} from '../reducers/quickRoutines';
import {SettingsState} from '../reducers/settings';
import {TestsState} from '../reducers/tests';

export type MyRootState = {
  exercises: ExercisesState;
  profile: ProfileState;
  tests: TestsState;
  quickRoutines: QuickRoutinesState;
  education: EducationState;
  settings: SettingsState;
};

export enum Level {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum Goal {
  STRENGTH = 'strength',
  FITNESS = 'fitness',
  WEIGHT_LOSS = 'weightLoss',
  INJURY_PREVENTION = 'injuryPrevention',
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

export interface StepSample {
  date: string;
  value: number;
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
}

export interface Plan {
  user: string;
  workouts: {
    name: string;
    dates: string[];
    exercises: {
      exercise: string;
      sets: number;
      reps: number;
      duration: number;
      resistanceScale: number;
      restTime: number;
      additionalNotes: string;
    }[];
  }[];
  nutrition: {
    preWorkout: string;
    postWorkout: string;
    general: string;
  };
  tests: {
    test: string;
    dates: string[];
  }[];
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