import {ExercisesState} from '../reducers/exercises';
import {ProfileState} from '../reducers/profile';
import {TestsState} from '../reducers/tests';

export type MyRootState = {
  exercises: ExercisesState;
  profile: ProfileState;
  tests: TestsState;
};

export enum Level {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum Goal {
  STRENGTH = 'strength',
  BALANCE = 'balance',
  FLEXIBILITY = 'flexibility',
  CARDIO = 'cardiovascular',
}

export enum StrengthArea {
  UPPER = 'upper',
  LOWER = 'lower',
  FULL = 'full',
}

export enum FlexibilityArea {
  SHOULDERS = 'shoulders',
  HIPS = 'hips',
  SPINE = 'spine',
}

export enum Purpose {
  EXERCISE = 'exercise',
  CALORIES = 'calories',
  FITNESS = 'fitness',
}

export enum Location {
  GYM = 'gym',
  HOME = 'home',
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