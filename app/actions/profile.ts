import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import Profile, {Gender, Unit} from '../types/Profile';
import {Goal, Purpose, Sample, StepSample} from '../types/Shared';

export const SET_PROFILE = 'SET_PROFILE';
export const SET_LOGGED_IN = 'SET_LOGGED_IN';
export const SET_HAS_VIEWED_WELCOME = 'SET_HAS_VIEWED_WELCOME';
export const SIGN_UP = 'SIGN_UP';
export const GET_SAMPLES = 'GET_SAMPLES';
export const SET_MONTHLY_WEIGHT_SAMPLES = 'SET_MONTHLY_WEIGHT_SAMPLES';
export const SET_MONTHLY_STEP_SAMPLES = 'SET_MONTHLY_STEP_SAMPLES';
export const SET_WEEKLY_STEPS = 'SET_WEEKLY_STEPS';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const SET_WORKOUT_REMINDERS = 'SET_WORKOUT_REMINDERS';
export const SET_WORKOUT_REMINDER_TIME = 'SET_WORKOUT_REMINDER_TIME';
export const SET_MONTHLY_TEST_REMINDERS = 'SET_MONTHLY_TEST_REMINDERS';
export const SET_STEP = 'SET_STEP';
export const HANDLE_AUTH = 'HANDLE_AUTH';
export const SET_PREMIUM = 'SET_PREMIUM';
export const SET_ADMIN = 'SET_ADMIN';
export const GET_CONNECTIONS = 'GET_CONNECTIONS';
export const SET_CONNECTIONS = 'SET_CONNECTIONS';

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

export interface SetStepAction {
  type: typeof SET_STEP;
  payload: number;
}

export interface SignUpPayload {
  dry?: boolean;
  name: string;
  dob: string;
  weight: number;
  height: number;
  unit: Unit;
  gender: Gender;
  goals: Goal[];
  workoutFrequency: number;
  purpose: Purpose;
  password?: string;
  email: string;
}

export interface UpdateProfilePayload {
  dob?: string;
  weight?: number;
  height?: number;
  gender?: Gender;
  unit?: Unit;
  goals?: Goal[];
  workoutFrequency?: number;
  purpose?: Purpose;
}

export interface SignUpAction {
  type: typeof SIGN_UP;
  payload: SignUpPayload;
}

export interface UpdateProfileAction {
  type: typeof UPDATE_PROFILE;
  payload: UpdateProfilePayload;
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

export interface SetWorkoutRemindersAction {
  type: typeof SET_WORKOUT_REMINDERS;
  payload: boolean;
}

export interface SetWorkoutReminderTimeAction {
  type: typeof SET_WORKOUT_REMINDER_TIME;
  payload: Date;
}

export interface SetMonthlyTestRemindersAction {
  type: typeof SET_MONTHLY_TEST_REMINDERS;
  payload: boolean;
}

export interface HandleAuthAction {
  type: typeof HANDLE_AUTH;
  payload: FirebaseAuthTypes.User;
}

export interface SetPremiumAction {
  type: typeof SET_PREMIUM;
  payload: boolean;
}

export interface SetAdminAction {
  type: typeof SET_ADMIN;
  payload: boolean;
}

export interface GetConnectionsAction {
  type: typeof GET_CONNECTIONS;
}

export interface SetConnectionsAction {
  type: typeof SET_CONNECTIONS;
  payload: {[key: string]: Profile};
}

export type ProfileActionTypes =
  | setProfileAction
  | SetLoggedInAction
  | ViewedWelcomeAction
  | SignUpAction
  | SetMonthlyWeightSamplesAction
  | GetSamplesAction
  | SetMonthlyStepSamplesAction
  | SetWeeklyStepsAction
  | UpdateProfileAction
  | SetWorkoutRemindersAction
  | SetWorkoutReminderTimeAction
  | SetMonthlyTestRemindersAction
  | SetStepAction
  | HandleAuthAction
  | SetPremiumAction
  | SetAdminAction
  | GetConnectionsAction
  | SetConnectionsAction;

export const setProfile = (profile: Profile): setProfileAction => ({
  type: SET_PROFILE,
  profile,
});

export const updateProfile = (
  payload: UpdateProfilePayload,
): UpdateProfileAction => ({
  type: UPDATE_PROFILE,
  payload,
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

export const setWorkoutReminders = (
  payload: boolean,
): SetWorkoutRemindersAction => ({
  type: SET_WORKOUT_REMINDERS,
  payload,
});

export const setWorkoutReminderTime = (
  payload: Date,
): SetWorkoutReminderTimeAction => ({
  type: SET_WORKOUT_REMINDER_TIME,
  payload,
});

export const setMonthlyTestReminders = (
  payload: boolean,
): SetMonthlyTestRemindersAction => ({
  type: SET_MONTHLY_TEST_REMINDERS,
  payload,
});

export const setStep = (step: number): SetStepAction => ({
  type: SET_STEP,
  payload: step,
});

export const handleAuth = (user: FirebaseAuthTypes.User) => ({
  type: HANDLE_AUTH,
  payload: user,
});

export const setPremium = (premium: boolean): SetPremiumAction => ({
  type: SET_PREMIUM,
  payload: premium,
});

export const setAdmin = (payload: boolean): SetAdminAction => ({
  type: SET_ADMIN,
  payload,
});

export const getConnections = (): GetConnectionsAction => ({
  type: GET_CONNECTIONS,
});

export const setConnections = (connections: {
  [key: string]: Profile;
}): SetConnectionsAction => ({
  type: SET_CONNECTIONS,
  payload: connections,
});
