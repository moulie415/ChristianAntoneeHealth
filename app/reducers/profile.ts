import {
  SET_PROFILE,
  SET_LOGGED_IN,
  SET_HAS_VIEWED_WELCOME,
  ProfileActionTypes,
  SET_MONTHLY_WEIGHT_SAMPLES,
  SET_MONTHLY_STEP_SAMPLES,
  SET_WEEKLY_STEPS,
  SET_WORKOUT_REMINDERS,
  SET_WORKOUT_REMINDER_TIME,
  SET_MONTHLY_TEST_REMINDERS,
  SET_STEP,
  SET_PREMIUM,
  SET_ADMIN,
  SET_CONNECTIONS,
  SET_LOADING,
  SET_MESSAGES,
} from '../actions/profile';
import Message from '../types/Message';
import Profile from '../types/Profile';
import {Sample, StepSample} from '../types/Shared';

export interface ProfileState {
  step: number;
  profile: Profile;
  loggedIn: boolean;
  hasViewedWelcome: boolean;
  hasViewedSignUp: boolean;
  weightSamples: {[key: number]: Sample[]};
  stepSamples: {[key: number]: StepSample[]};
  weeklySteps: StepSample[];
  workoutReminders: boolean;
  workoutReminderTime: string;
  monthlyTestReminders: boolean;
  monthlyTestReminderTime: string;
  connections: {[key: string]: Profile};
  loading: boolean;
  messages: {[key: string]: {[key: string]: Message}};
}

const initialState: ProfileState = {
  step: 0,
  profile: {email: '', uid: ''},
  loggedIn: false,
  hasViewedWelcome: false,
  hasViewedSignUp: false,
  weightSamples: {},
  stepSamples: {},
  weeklySteps: [],
  workoutReminders: true,
  workoutReminderTime: new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + 1,
    9,
    0,
    0,
  ).toISOString(),
  monthlyTestReminders: true,
  monthlyTestReminderTime: new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate(),
    new Date().getHours(),
    9,
    0,
  ).toISOString(),
  connections: {},
  loading: false,
  messages: {},
};

const reducer = (
  state = initialState,
  action: ProfileActionTypes,
): ProfileState => {
  switch (action.type) {
    case SET_STEP:
      return {
        ...state,
        step: action.payload,
      };
    case SET_PROFILE:
      return {
        ...state,
        profile: action.profile,
      };
    case SET_LOGGED_IN:
      return action.payload
        ? {
            ...state,
            loggedIn: action.payload,
          }
        : {...initialState, loggedIn: action.payload};
    case SET_HAS_VIEWED_WELCOME:
      return {
        ...state,
        hasViewedWelcome: true,
      };
    case SET_MONTHLY_WEIGHT_SAMPLES:
      return {
        ...state,
        weightSamples: {
          ...state.weightSamples,
          [action.payload.month]: action.payload.samples,
        },
      };
    case SET_MONTHLY_STEP_SAMPLES:
      return {
        ...state,
        stepSamples: {
          ...state.stepSamples,
          [action.payload.month]: action.payload.samples,
        },
      };
    case SET_WEEKLY_STEPS:
      return {
        ...state,
        weeklySteps: action.payload,
      };
    case SET_WORKOUT_REMINDERS:
      return {
        ...state,
        workoutReminders: action.payload,
      };
    case SET_WORKOUT_REMINDER_TIME:
      return {
        ...state,
        workoutReminderTime: action.payload.toISOString(),
      };
    case SET_MONTHLY_TEST_REMINDERS:
      return {
        ...state,
        monthlyTestReminders: action.payload,
      };
    case SET_PREMIUM:
      return {
        ...state,
        profile: {...state.profile, premium: action.payload},
      };
    case SET_ADMIN:
      return {
        ...state,
        profile: {...state.profile, admin: action.payload},
      };
    case SET_CONNECTIONS:
      return {
        ...state,
        connections: {...state.connections, ...action.payload},
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_MESSAGES:
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.uid]: {
            ...state.messages[action.payload.uid],
            ...action.payload.messages,
          },
        },
      };
    default:
      return state;
  }
};

export default reducer;
