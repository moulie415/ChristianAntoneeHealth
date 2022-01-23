import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {AppStateStatus} from 'react-native';
import PushNotification from 'react-native-push-notification';
import Chat from '../types/Chat';
import Message from '../types/Message';
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
export const SET_LOADING = 'SET_LOADING';
export const SET_MESSAGES = 'SET_MESSAGES';
export const SET_CHATS = 'SET_CHATS';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SET_MESSAGE = 'SET_MESSAGE';
export const SET_READ = 'SET_READ';
export const SET_UNREAD = 'SET_UNREAD';
export const SET_APP_STATE = 'SET_APP_STATE';
export const LOAD_EARLIER_MESSAGES = 'LOAD_EARLIER_MESSAGES';

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
  avatar?: string;
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

export interface SetLoading {
  type: typeof SET_LOADING;
  payload: boolean;
}

export interface SetMessagesAction {
  type: typeof SET_MESSAGES;
  payload: {uid: string; messages: {[key: string]: Message}};
}

export interface SetChatsAction {
  type: typeof SET_CHATS;
  payload: {[key: string]: Chat};
}

export interface SendMessageAction {
  type: typeof SEND_MESSAGE;
  payload: {message: Message; chatId: string; uid: string; mute?: boolean};
}

export interface SetMessageAction {
  type: typeof SET_MESSAGE;
  payload: {message: Message; uid: string};
}

export interface SetReadAction {
  type: typeof SET_READ;
  payload: string;
}

export interface SetUnreadAction {
  type: typeof SET_UNREAD;
  payload: {[key: string]: number};
}

export interface SetAppStateAction {
  type: typeof SET_APP_STATE;
  payload: AppStateStatus;
}

export interface LoadEarlierMessagesAction {
  type: typeof LOAD_EARLIER_MESSAGES;
  payload: {chatId: string; uid: string; startAfter: number};
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
  | SetConnectionsAction
  | SetLoading
  | SetMessagesAction
  | SetChatsAction
  | SendMessageAction
  | SetMessageAction
  | SetReadAction
  | SetUnreadAction
  | SetAppStateAction
  | LoadEarlierMessagesAction;

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

export const setLoading = (loading: boolean): SetLoading => ({
  type: SET_LOADING,
  payload: loading,
});

export const setMessages = (
  uid: string,
  snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
): SetMessagesAction => {
  const messages = snapshot.docs.reduce((acc: {[id: string]: Message}, cur) => {
    const message: any = cur.data();
    acc[message ? message._id : cur.id] = {...message, id: cur.id};
    return acc;
  }, {});
  return {
    type: SET_MESSAGES,
    payload: {uid, messages},
  };
};

export const setMessagesObj = (
  uid: string,
  messages: {[key: string]: Message},
): SetMessagesAction => ({
  type: SET_MESSAGES,
  payload: {uid, messages},
});

export const setChats = (chats: {[key: string]: Chat}): SetChatsAction => ({
  type: SET_CHATS,
  payload: chats,
});

export const sendMessage = (
  message: Message,
  chatId: string,
  uid: string,
): SendMessageAction => ({
  type: SEND_MESSAGE,
  payload: {message, chatId, uid},
});

export const setMessage = (
  uid: string,
  message: Message,
): SetMessageAction => ({
  type: SET_MESSAGE,
  payload: {uid, message},
});

export const setRead = (uid: string): SetReadAction => ({
  type: SET_READ,
  payload: uid,
});

export const setUnread = (unread: {[key: string]: number}): SetUnreadAction => {
  const count = Object.values(unread).reduce((acc, cur) => acc + cur, 0);
  PushNotification.setApplicationIconBadgeNumber(count);
  return {
    type: SET_UNREAD,
    payload: unread,
  };
};

export const setAppState = (appState: AppStateStatus): SetAppStateAction => ({
  type: SET_APP_STATE,
  payload: appState,
});

export const loadEarlierMessages = (
  chatId: string,
  uid: string,
  startAfter: number,
): LoadEarlierMessagesAction => ({
  type: LOAD_EARLIER_MESSAGES,
  payload: {chatId, uid, startAfter},
});
