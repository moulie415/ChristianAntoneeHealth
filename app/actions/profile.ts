import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {AppStateStatus} from 'react-native';
import {PurchasesEntitlementInfo} from 'react-native-purchases';
import PushNotification from 'react-native-push-notification';
import {WeeklyItems} from '../reducers/profile';
import Chat from '../types/Chat';
import Message from '../types/Message';
import Profile, {Gender, Unit} from '../types/Profile';
import {Equipment} from '../types/QuickRoutines';
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
export const SET_HAS_VIEWED_TOUR = 'SET_HAS_VIEWED_TOUR';
export const SET_CHAT_MESSAGE = 'SET_CHAT_MESSAGE';

export interface SetProfileAction {
  type: typeof SET_PROFILE;
  profile: Profile;
}

export interface SetLoggedInAction {
  type: typeof SET_LOGGED_IN;
  payload: boolean;
}

export interface SignUpPayload {
  name: string;
  surname: string;
  dob: string;
  weight: number;
  height: number;
  gender: Gender;
  marketing: boolean;
  goal: Goal;
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

export interface SetWeightSamplesAction {
  type: typeof SET_WEIGHT_SAMPLES;
  payload: {samples: Sample[]};
}

export interface SetHeightSamplesAction {
  type: typeof SET_HEIGHT_SAMPLES;
  payload: {samples: Sample[]};
}

export interface SetBodyFatPercentageSamplesAction {
  type: typeof SET_BODY_FAT_PERCENTAGE_SAMPLES;
  payload: {samples: Sample[]};
}

export interface SetMuscleMassSamplesAction {
  type: typeof SET_MUSCLE_MASS_SAMPLES;
  payload: {samples: Sample[]};
}

export interface SetBoneMassSamplesAction {
  type: typeof SET_BONE_MASS_SAMPLES;
  payload: {samples: Sample[]};
}

export interface SetStepSamplesAction {
  type: typeof SET_STEP_SAMPLES;
  payload: {samples: StepSample[]};
}

export interface SetWeeklyStepsAction {
  type: typeof SET_WEEKLY_STEPS;
  payload: StepSample[];
}

export interface HandleAuthAction {
  type: typeof HANDLE_AUTH;
  payload: FirebaseAuthTypes.User;
}

export interface SetPremiumAction {
  type: typeof SET_PREMIUM;
  payload: false | {[key: string]: PurchasesEntitlementInfo};
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

export interface GetWeeklyItemsAction {
  type: typeof GET_WEEKLY_ITEMS;
}

export interface SetWeeklyItemsAction {
  type: typeof SET_WEEKLY_ITEMS;
  payload: WeeklyItems;
}

export interface SetHasViewedTourAction {
  type: typeof SET_HAS_VIEWED_TOUR;
}

export interface SetChatMessageAction {
  type: typeof SET_CHAT_MESSAGE;
  payload: {uid: string; message: string};
}

export type ProfileActionTypes =
  | SetProfileAction
  | SetLoggedInAction
  | SignUpAction
  | SetWeightSamplesAction
  | GetSamplesAction
  | SetStepSamplesAction
  | SetWeeklyStepsAction
  | UpdateProfileAction
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
  | LoadEarlierMessagesAction
  | GetWeeklyItemsAction
  | SetWeeklyItemsAction
  | SetHeightSamplesAction
  | SetBoneMassSamplesAction
  | SetBodyFatPercentageSamplesAction
  | SetMuscleMassSamplesAction
  | SetHasViewedTourAction
  | SetChatMessageAction;

export const setProfile = (profile: Profile): SetProfileAction => ({
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

export const signUp = (payload: SignUpPayload): SignUpAction => ({
  type: SIGN_UP,
  payload,
});

export const getSamples = (): GetSamplesAction => ({
  type: GET_SAMPLES,
});

export const setWeightSamples = (
  samples: Sample[],
): SetWeightSamplesAction => ({
  type: SET_WEIGHT_SAMPLES,
  payload: {samples},
});

export const setHeightSamples = (
  samples: Sample[],
): SetHeightSamplesAction => ({
  type: SET_HEIGHT_SAMPLES,
  payload: {samples},
});

export const setBodyFatPercentageSamples = (
  samples: Sample[],
): SetBodyFatPercentageSamplesAction => ({
  type: SET_BODY_FAT_PERCENTAGE_SAMPLES,
  payload: {samples},
});

export const setMuscleMassSamples = (
  samples: Sample[],
): SetMuscleMassSamplesAction => ({
  type: SET_MUSCLE_MASS_SAMPLES,
  payload: {samples},
});

export const setBoneMassSamples = (
  samples: Sample[],
): SetBoneMassSamplesAction => ({
  type: SET_BONE_MASS_SAMPLES,
  payload: {samples},
});

export const setStepSamples = (
  samples: StepSample[],
): SetStepSamplesAction => ({
  type: SET_STEP_SAMPLES,
  payload: {samples},
});

export const setWeeklySteps = (steps: StepSample[]): SetWeeklyStepsAction => ({
  type: SET_WEEKLY_STEPS,
  payload: steps,
});

export const handleAuth = (user: FirebaseAuthTypes.User) => ({
  type: HANDLE_AUTH,
  payload: user,
});

export const setPremium = (
  premium: false | {[key: string]: PurchasesEntitlementInfo},
): SetPremiumAction => ({
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

export const getWeeklyItems = (): GetWeeklyItemsAction => ({
  type: GET_WEEKLY_ITEMS,
});

export const setWeeklyItems = (payload: WeeklyItems): SetWeeklyItemsAction => ({
  type: SET_WEEKLY_ITEMS,
  payload,
});

export const setHasViewedTour = (): SetHasViewedTourAction => ({
  type: SET_HAS_VIEWED_TOUR,
});

export const setChatMessage = (
  uid: string,
  message: string,
): SetChatMessageAction => ({
  type: SET_CHAT_MESSAGE,
  payload: {uid, message},
});
