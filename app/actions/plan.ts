import {Plan} from '../types/Shared';

export const GET_PLAN = 'GET_PLAN';
export const SET_PLAN = 'SET_PLAN';
export const SET_SYNCED_PLAN_EVENT = 'SET_SYNCED_PLAN_EVENT';
export const SYNC_PLAN_WITH_CALENDAR = 'SYNC_PLAN_WITH_CALENDAR';
export const SET_CALENDAR_ID = 'SET_CALENDAR_ID';

export interface GetPlanAction {
  type: typeof GET_PLAN;
}

export interface SetPlanAction {
  type: typeof SET_PLAN;
  payload?: Plan;
}

export interface SetSyncedPlanEventAction {
  type: typeof SET_SYNCED_PLAN_EVENT;
  payload: {key: string; id: string};
}

export interface SyncPlanWithCalendarAction {
  type: typeof SYNC_PLAN_WITH_CALENDAR;
  payload: {plan: Plan; sync: boolean; calendarId?: string};
}

export interface SetCalendarIdAction {
  type: typeof SET_CALENDAR_ID;
  payload: string;
}

export type PlanActionTypes =
  | GetPlanAction
  | SetPlanAction
  | SetSyncedPlanEventAction
  | SyncPlanWithCalendarAction
  | SetCalendarIdAction;

export const getPlan = (): GetPlanAction => ({
  type: GET_PLAN,
});

export const setPlan = (payload?: Plan): SetPlanAction => ({
  type: SET_PLAN,
  payload,
});

export const setSyncedPlanEvent = (
  key: string,
  id: string,
): SetSyncedPlanEventAction => ({
  type: SET_SYNCED_PLAN_EVENT,
  payload: {key, id},
});

export const syncPlanWithCalendar = (
  plan: Plan,
  sync: boolean,
): SyncPlanWithCalendarAction => ({
  type: SYNC_PLAN_WITH_CALENDAR,
  payload: {plan, sync},
});

export const setCalendarId = (id: string): SetCalendarIdAction => ({
  type: SET_CALENDAR_ID,
  payload: id,
});
