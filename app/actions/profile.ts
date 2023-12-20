import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import Chat from '../types/Chat';
import Message from '../types/Message';
import Profile, {Gender, Unit} from '../types/Profile';
import {Area, Equipment} from '../types/QuickRoutines';
import {Goal, Level, Sample, StepSample} from '../types/Shared';

export const SET_PROFILE = 'SET_PROFILE';
export const SET_LOGGED_IN = 'SET_LOGGED_IN';
export const SIGN_UP = 'SIGN_UP';
export const GET_SAMPLES = 'GET_SAMPLES';
export const SET_WEIGHT_SAMPLES = 'SET_WEIGHT_SAMPLES';
export const SET_HEIGHT_SAMPLES = 'SET_HEIGHT_SAMPLES';
export const SET_BODY_FAT_PERCENTAGE_SAMPLES =
  'SET_BODY_FAT_PERCENTAGE_SAMPLES';
export const SET_MUSCLE_MASS_SAMPLES = 'SET_MUSCLE_MASS_SAMPLES';
export const SET_BONE_MASS_SAMPLES = 'SET_BONE_MASS_SAMPLES';
export const SET_STEP_SAMPLES = 'SET_STEP_SAMPLES';
export const SET_WEEKLY_STEPS = 'SET_WEEKLY_STEPS';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
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
export const SET_PLAN_READ = 'SET_PLAN_READ';
export const SET_PLAN_UNREAD = 'SET_PLAN_UNREAD';
export const SET_APP_STATE = 'SET_APP_STATE';
export const LOAD_EARLIER_MESSAGES = 'LOAD_EARLIER_MESSAGES';
export const SET_VIEWED_PLAN = 'SET_VIEWED_PLAN';
export const GET_WEEKLY_ITEMS = 'GET_WEEKLY_ITEMS';
export const SET_WEEKLY_ITEMS = 'SET_WEEKLY_ITEMS';
export const GET_WEEKLY_ITEMS_FOR_CONNECTION =
  'GET_WEEKLY_ITEMS_FOR_CONNECTION';
export const SET_WEEKLY_ITEMS_FOR_CONNECTION =
  'SET_WEEKLY_ITEMS_FOR_CONNECTION';
export const SET_HAS_VIEWED_TOUR = 'SET_HAS_VIEWED_TOUR';
export const SET_CHAT_MESSAGE = 'SET_CHAT_MESSAGE';
export const SET_LOGIN_EMAIL = 'SET_LOGIN_EMAIL';
export const SET_LOGIN_PASSWORD = 'SET_LOGIN_PASSWORD';

export interface SignUpPayload {
  name: string;
  surname: string;
  dob: string;
  weight: number;
  height: number;
  gender: Gender;
  marketing: boolean;
  goal: Goal;
  area: Area;
  equipment: Equipment;
  experience: Level;
  fromProfile?: boolean;
}

export interface UpdateProfilePayload {
  dob?: string;
  weight?: number;
  height?: number;
  gender?: Gender;
  marketing?: boolean;
  goal?: Goal;
  avatar?: string;
  bodyFatPercentage?: number;
  muscleMass?: number;
  boneMass?: number;
  workoutReminders?: boolean;
  workoutReminderTime?: string;
  testReminderTime?: string;
  testReminders?: boolean;
  autoPlay?: boolean;
  prepTime?: number;
  workoutMusic?: boolean;
  syncPlanWithCalendar?: boolean;
  goalReminders?: boolean;
}

export interface SendMessageAction {
  type: typeof SEND_MESSAGE;
  payload: {message: Message; chatId: string; uid: string; mute?: boolean};
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

export interface HandleAuthAction {
  type: typeof HANDLE_AUTH;
  payload: FirebaseAuthTypes.User;
}

export interface GetConnectionsAction {
  type: typeof GET_CONNECTIONS;
}

export interface LoadEarlierMessagesAction {
  type: typeof LOAD_EARLIER_MESSAGES;
  payload: {chatId: string; uid: string; startAfter: number};
}

export interface GetWeeklyItemsAction {
  type: typeof GET_WEEKLY_ITEMS;
}

export interface GetWeeklyItemsForConnection {
  type: typeof GET_WEEKLY_ITEMS_FOR_CONNECTION;
  payload: string;
}

export type ProfileActionTypes =
  | SignUpAction
  | GetSamplesAction
  | UpdateProfileAction
  | HandleAuthAction
  | GetConnectionsAction
  | LoadEarlierMessagesAction
  | GetWeeklyItemsAction
  | GetWeeklyItemsForConnection;

export const updateProfile = (
  payload: UpdateProfilePayload,
): UpdateProfileAction => ({
  type: UPDATE_PROFILE,
  payload,
});

export const signUp = (payload: SignUpPayload): SignUpAction => ({
  type: SIGN_UP,
  payload,
});

export const getSamples = (): GetSamplesAction => ({
  type: GET_SAMPLES,
});

export const handleAuth = (user: FirebaseAuthTypes.User) => ({
  type: HANDLE_AUTH,
  payload: user,
});

export const getConnections = (): GetConnectionsAction => ({
  type: GET_CONNECTIONS,
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

export const loadEarlierMessages = (
  chatId: string,
  uid: string,
  startAfter: number,
): LoadEarlierMessagesAction => ({
  type: LOAD_EARLIER_MESSAGES,
  payload: {chatId, uid, startAfter},
});

export const getWeeklyItems = (): GetWeeklyItemsAction => ({
  type: GET_WEEKLY_ITEMS,
});

export const getWeeklyItemsForConnection = (
  uid: string,
): GetWeeklyItemsForConnection => ({
  type: GET_WEEKLY_ITEMS_FOR_CONNECTION,
  payload: uid,
});
