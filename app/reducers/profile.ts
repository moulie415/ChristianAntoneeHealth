import {
  SET_PROFILE,
  SET_LOGGED_IN,
  SET_HAS_VIEWED_WELCOME,
  ProfileActionTypes,
  SET_MONTHLY_WEIGHT_SAMPLES,
  SET_MONTHLY_STEP_SAMPLES,
  SET_WEEKLY_STEPS,
  SET_WORKOUT_REMINDERS_DISABLED,
  SET_WORKOUT_REMINDER_TIME,
} from '../actions/profile';
import Profile from '../types/Profile';
import {Sample, StepSample} from '../types/Shared';

export interface ProfileState {
  profile: Profile;
  loggedIn: boolean;
  hasViewedWelcome: boolean;
  hasViewedSignUp: boolean;
  weightSamples: {[key: number]: Sample[]};
  stepSamples: {[key: number]: StepSample[]};
  weeklySteps: StepSample[];
  workoutRemindersDisabled: boolean;
  workoutReminderTime: string;
}

const initialState: ProfileState = {
  profile: {email: '', uid: ''},
  loggedIn: false,
  hasViewedWelcome: false,
  hasViewedSignUp: false,
  weightSamples: {},
  stepSamples: {},
  weeklySteps: [],
  workoutRemindersDisabled: false,
  workoutReminderTime: new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    9,
    0,
    0,
  ).toISOString(),
};

const reducer = (
  state = initialState,
  action: ProfileActionTypes,
): ProfileState => {
  switch (action.type) {
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
    case SET_WORKOUT_REMINDERS_DISABLED:
      return {
        ...state,
        workoutRemindersDisabled: action.payload,
      };
    case SET_WORKOUT_REMINDER_TIME:
      return {
        ...state,
        workoutReminderTime: action.payload.toISOString(),
      };
    default:
      return state;
  }
};

export default reducer;
