import Profile, {Gender, HeightMetric, WeightMetric} from '../types/Profile';
import {Goal, Purpose, Sample, StepSample} from '../types/Shared';

export const SET_PROFILE = 'SET_PROFILE';
export const SET_LOGGED_IN = 'SET_LOGGED_IN';
export const SET_HAS_VIEWED_WELCOME = 'SET_HAS_VIEWED_WELCOME';
export const SIGN_UP = 'SIGN_UP';
export const GET_SAMPLES = 'GET_SAMPLES';
export const SET_MONTHLY_WEIGHT_SAMPLES = 'SET_MONTHLY_WEIGHT_SAMPLES';
export const SET_MONTHLY_STEP_SAMPLES = 'SET_MONTHLY_STEP_SAMPLES';
export const SET_WEEKLY_STEPS = 'SET_WEEKLY_STEPS';

interface setProfileAction {
  type: typeof SET_PROFILE;
  profile: Profile;
}

export interface SetLoggedInAction {
  type: typeof SET_LOGGED_IN;
  payload: boolean;
}

interface ViewedWelcomeAction {
  type: typeof SET_HAS_VIEWED_WELCOME;
}

export interface SignUpPayload {
  dry?: boolean;
  name: string;
  dob: string;
  weight: number;
  weightMetric: WeightMetric;
  height: number;
  heightMetric: HeightMetric;
  gender: Gender;
  goals: Goal[];
  workoutFrequency: number;
  purpose: Purpose;
  password?: string;
  email: string;
}

export interface SignUpAction {
  type: typeof SIGN_UP;
  payload: SignUpPayload;
}

export interface GetSamplesAction {
  type: typeof GET_SAMPLES;
}

export interface SetMonthlyWeightSamplesAction {
  type: typeof SET_MONTHLY_WEIGHT_SAMPLES;
  payload: {samples: Sample[]; month: number};
}

export interface SetMonthlyStepSamplesAction {
  type: typeof SET_MONTHLY_STEP_SAMPLES;
  payload: {samples: StepSample[]; month: number};
}

export interface SetWeeklyStepsAction {
  type: typeof SET_WEEKLY_STEPS;
  payload: StepSample[];
}

export type ProfileActionTypes =
  | setProfileAction
  | SetLoggedInAction
  | ViewedWelcomeAction
  | SignUpAction
  | SetMonthlyWeightSamplesAction
  | GetSamplesAction
  | SetMonthlyStepSamplesAction
  | SetWeeklyStepsAction;

export const setProfile = (profile: Profile): setProfileAction => ({
  type: SET_PROFILE,
  profile,
});

export const setLoggedIn = (loggedIn: boolean): SetLoggedInAction => ({
  type: SET_LOGGED_IN,
  payload: loggedIn,
});

export const viewedWelcome = (): ViewedWelcomeAction => ({
  type: SET_HAS_VIEWED_WELCOME,
});

export const signUp = (payload: SignUpPayload): SignUpAction => ({
  type: SIGN_UP,
  payload,
});

export const getSamples = (): GetSamplesAction => ({
  type: GET_SAMPLES,
});

export const setMonthlyWeightSamples = (
  samples: Sample[],
  month: number,
): SetMonthlyWeightSamplesAction => ({
  type: SET_MONTHLY_WEIGHT_SAMPLES,
  payload: {samples, month},
});

export const setMonthlyStepSamples = (
  samples: StepSample[],
  month: number,
): SetMonthlyStepSamplesAction => ({
  type: SET_MONTHLY_STEP_SAMPLES,
  payload: {samples, month},
});

export const setWeeklySteps = (steps: StepSample[]): SetWeeklyStepsAction => ({
  type: SET_WEEKLY_STEPS,
  payload: steps,
});
