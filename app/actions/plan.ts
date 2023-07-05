import {Plan} from '../types/Shared';

export const GET_PLAN = 'GET_PLAN';
export const SET_PLAN = 'SET_PLAN';
export const SET_SYNCED_PLAN_EVENT = 'SET_SYNCED_PLAN_EVENT';

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

export type PlanActionTypes =
  | GetPlanAction
  | SetPlanAction
  | SetSyncedPlanEventAction;

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
