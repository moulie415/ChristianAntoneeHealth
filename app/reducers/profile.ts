import {AppState, AppStateStatus} from 'react-native';
import {PlanActionTypes, SET_PLAN, SET_USED_FREE_PLAN} from '../actions/plan';
import {
  SET_PROFILE,
  SET_LOGGED_IN,
  ProfileActionTypes,
  SET_WEIGHT_SAMPLES,
  SET_STEP_SAMPLES,
  SET_WEEKLY_STEPS,
  SET_WORKOUT_REMINDERS,
  SET_WORKOUT_REMINDER_TIME,
  SET_TEST_REMINDERS,
  SET_PREMIUM,
  SET_ADMIN,
  SET_CONNECTIONS,
  SET_LOADING,
  SET_MESSAGES,
  SET_CHATS,
  SET_MESSAGE,
  SET_UNREAD,
  SET_APP_STATE,
  SET_VIEWED_PLAN,
  SET_WEEKLY_ITEMS,
  SET_PLAN_STATUS,
  SET_HEIGHT_SAMPLES,
  SET_BODY_FAT_PERCENTAGE_SAMPLES,
  SET_MUSCLE_MASS_SAMPLES,
  SET_BONE_MASS_SAMPLES,
  SET_HAS_VIEWED_TOUR,
} from '../actions/profile';
import Chat from '../types/Chat';
import Message from '../types/Message';
import Profile, {PlanStatus} from '../types/Profile';
import {SavedQuickRoutine, SavedTest} from '../types/SavedItem';
import {Plan, Sample, StepSample} from '../types/Shared';

export interface WeeklyItems {
  quickRoutines: {[key: string]: SavedQuickRoutine};
  tests: {[key: string]: SavedTest};
}

export interface ProfileState {
  step: number;
  profile: Profile;
  loggedIn: boolean;
  weightSamples: Sample[];
  heightSamples: Sample[];
  bodyFatPercentageSamples: Sample[];
  muscleMassSamples: Sample[];
  boneMassSamples: Sample[];
  stepSamples: StepSample[];
  weeklySteps: StepSample[];
  workoutReminders: boolean;
  reminderTime: string;
  testReminderTime: string;
  testReminders: boolean;
  connections: {[key: string]: Profile};
  loading: boolean;
  messages: {[key: string]: {[key: string]: Message}};
  chats: {[key: string]: Chat};
  state: AppStateStatus;
  viewedPlan: boolean;
  weeklyItems: WeeklyItems;
  plan?: Plan;
  hasViewedTour: boolean;
}

const initialState: ProfileState = {
  step: 0,
  profile: {
    email: '',
    uid: '',
    unread: {},
    planStatus: PlanStatus.UNINITIALIZED,
    premium: false,
  },
  loggedIn: false,
  weightSamples: [],
  heightSamples: [],
  bodyFatPercentageSamples: [],
  muscleMassSamples: [],
  boneMassSamples: [],
  stepSamples: [],
  weeklySteps: [],
  workoutReminders: true,
  reminderTime: new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + 1,
    9,
    0,
    0,
  ).toISOString(),
  testReminderTime: new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + 1,
    9,
    0,
    0,
  ).toISOString(),
  testReminders: true,
  connections: {},
  loading: false,
  messages: {},
  chats: {},
  state: AppState.currentState,
  viewedPlan: false,
  weeklyItems: {
    quickRoutines: {},
    tests: {},
  },
  hasViewedTour: false,
};

const reducer = (
  state = initialState,
  action: ProfileActionTypes | PlanActionTypes,
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
    case SET_WEIGHT_SAMPLES:
      return {
        ...state,
        weightSamples: action.payload.samples,
      };
    case SET_HEIGHT_SAMPLES:
      return {
        ...state,
        heightSamples: action.payload.samples,
      };
    case SET_BODY_FAT_PERCENTAGE_SAMPLES:
      return {
        ...state,
        bodyFatPercentageSamples: action.payload.samples,
      };
    case SET_MUSCLE_MASS_SAMPLES:
      return {
        ...state,
        muscleMassSamples: action.payload.samples,
      };
    case SET_BONE_MASS_SAMPLES:
      return {
        ...state,
        boneMassSamples: action.payload.samples,
      };
    case SET_STEP_SAMPLES:
      return {
        ...state,
        stepSamples: action.payload.samples,
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
        reminderTime: action.payload.toISOString(),
      };
    case SET_TEST_REMINDERS:
      return {
        ...state,
        testReminders: action.payload,
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
        connections: action.payload,
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
    case SET_CHATS:
      return {
        ...state,
        chats: {...state.chats, ...action.payload},
      };
    case SET_MESSAGE:
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.uid]: {
            ...state.messages[action.payload.uid],
            [action.payload.message._id]: action.payload.message,
          },
        },
      };
    case SET_UNREAD:
      return {
        ...state,
        profile: {...state.profile, unread: action.payload},
      };
    case SET_APP_STATE:
      return {
        ...state,
        state: action.payload,
      };
    case SET_VIEWED_PLAN:
      return {
        ...state,
        viewedPlan: true,
      };
    case SET_WEEKLY_ITEMS:
      return {
        ...state,
        weeklyItems: action.payload,
      };
    case SET_PLAN_STATUS:
      return {
        ...state,
        profile: {
          ...state.profile,
          planStatus: action.payload,
        },
      };
    case SET_USED_FREE_PLAN:
      return {
        ...state,
        profile: {
          ...state.profile,
          usedFreePlan: action.payload,
        },
      };
    case SET_PLAN:
      return {
        ...state,
        plan: action.payload,
      };
    case SET_HAS_VIEWED_TOUR:
      return {...state, hasViewedTour: true};
    default:
      return state;
  }
};

export default reducer;
