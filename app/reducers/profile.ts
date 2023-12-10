import {AppState, AppStateStatus} from 'react-native';
import {
  PlanActionTypes,
  SET_CALENDAR_ID,
  SET_PLAN,
  SET_SYNCED_PLAN_EVENT,
} from '../actions/plan';
import {
  SET_PROFILE,
  SET_LOGGED_IN,
  ProfileActionTypes,
  SET_WEIGHT_SAMPLES,
  SET_STEP_SAMPLES,
  SET_WEEKLY_STEPS,
  SET_PREMIUM,
  SET_ADMIN,
  SET_CONNECTIONS,
  SET_LOADING,
  SET_MESSAGES,
  SET_CHATS,
  SET_MESSAGE,
  SET_UNREAD,
  SET_APP_STATE,
  SET_WEEKLY_ITEMS,
  SET_HEIGHT_SAMPLES,
  SET_BODY_FAT_PERCENTAGE_SAMPLES,
  SET_MUSCLE_MASS_SAMPLES,
  SET_BONE_MASS_SAMPLES,
  SET_HAS_VIEWED_TOUR,
  SET_READ,
  SET_CHAT_MESSAGE,
  SET_LOGIN_EMAIL,
  SET_LOGIN_PASSWORD,
  SET_WEEKLY_ITEMS_FOR_CONNECTION,
} from '../actions/profile';
import Chat from '../types/Chat';
import Message from '../types/Message';
import Profile from '../types/Profile';
import {SavedQuickRoutine, SavedTest, SavedWorkout} from '../types/SavedItem';
import {Plan, Sample, StepSample} from '../types/Shared';

export interface WeeklyItems {
  quickRoutines: {[key: string]: SavedQuickRoutine};
  tests: {[key: string]: SavedTest};
  workouts: {[key: string]: SavedWorkout};
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
  connections: {[key: string]: Profile};
  connectionWeeklyItems: {[key: string]: WeeklyItems};
  loading: boolean;
  messages: {[key: string]: {[key: string]: Message}};
  chats: {[key: string]: Chat};
  chatMessages: {[key: string]: string};
  state: AppStateStatus;
  weeklyItems: WeeklyItems;
  plan?: Plan;
  hasViewedTour: boolean;
  syncedPlanEvents: {[key: string]: string};
  calendarId?: string;
  loginEmail: string;
  loginPassword: string;
}

const initialState: ProfileState = {
  step: 0,
  profile: {
    email: '',
    uid: '',
    unread: {},
    premium: false,
    workoutReminders: true,
    workoutReminderTime: new Date(
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
    syncPlanWithCalendar: false,
    autoPlay: true,
    prepTime: 15,
    workoutMusic: true,
  },
  loggedIn: false,
  weightSamples: [],
  heightSamples: [],
  bodyFatPercentageSamples: [],
  muscleMassSamples: [],
  boneMassSamples: [],
  stepSamples: [],
  weeklySteps: [],
  connections: {},
  connectionWeeklyItems: {},
  loading: false,
  messages: {},
  chats: {},
  chatMessages: {},
  state: AppState.currentState,
  weeklyItems: {
    quickRoutines: {},
    tests: {},
    workouts: {},
  },
  hasViewedTour: false,
  syncedPlanEvents: {},
  loginEmail: '',
  loginPassword: '',
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
        : {
            ...initialState,
            loginEmail: state.loginEmail,
            loginPassword: state.loginPassword,
            loggedIn: action.payload,
          };
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
    case SET_READ:
      return {
        ...state,
        profile: {
          ...state.profile,
          unread: {...state.profile.unread, [action.payload]: 0},
        },
      };
    case SET_APP_STATE:
      return {
        ...state,
        state: action.payload,
      };
    case SET_WEEKLY_ITEMS:
      return {
        ...state,
        weeklyItems: action.payload,
      };
    case SET_WEEKLY_ITEMS_FOR_CONNECTION:
      return {
        ...state,
        connectionWeeklyItems: {
          ...state.connectionWeeklyItems,
          [action.payload.uid]: action.payload.items,
        },
      };
    case SET_PLAN:
      return {
        ...state,
        plan: action.payload,
      };
    case SET_HAS_VIEWED_TOUR:
      return {...state, hasViewedTour: true};
    case SET_SYNCED_PLAN_EVENT:
      return {
        ...state,
        syncedPlanEvents: {
          ...state.syncedPlanEvents,
          [action.payload.key]: action.payload.id,
        },
      };
    case SET_CALENDAR_ID:
      return {
        ...state,
        calendarId: action.payload,
      };
    case SET_CHAT_MESSAGE:
      return {
        ...state,
        chatMessages: {
          ...state.chatMessages,
          [action.payload.uid]: action.payload.message,
        },
      };
    case SET_LOGIN_EMAIL:
      return {
        ...state,
        loginEmail: action.payload,
      };
    case SET_LOGIN_PASSWORD:
      return {
        ...state,
        loginPassword: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
