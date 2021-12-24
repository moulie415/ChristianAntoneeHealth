import {EducationState} from '../reducers/education';
import {ExercisesState} from '../reducers/exercises';
import {ProfileState} from '../reducers/profile';
import {QuickRoutinesState} from '../reducers/quickRoutines';
import {TestsState} from '../reducers/tests';

export type MyRootState = {
  exercises: ExercisesState;
  profile: ProfileState;
  tests: TestsState;
  quickRoutines: QuickRoutinesState;
  education: EducationState;
};

export enum Level {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum Goal {
  STRENGTH = 'strength',
  CARDIO = 'cardiovascular',
}

export enum StrengthArea {
  UPPER = 'upper',
  LOWER = 'lower',
  FULL = 'full',
}

export enum CardioType {
  HIT = 'hit',
  SBIT = 'sbit',
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
