import {Plan} from '../types/Shared';

export const GET_PLAN = 'GET_PLAN';
export const SET_PLAN = 'SET_PLAN';
export const SET_USED_FREE_PLAN = 'SET_USED_FREE_PLAN';

export interface GetPlanAction {
  type: typeof GET_PLAN;
}

export interface SetPlanAction {
  type: typeof SET_PLAN;
  payload?: Plan;
}

export interface SetUsedFreePlanAction {
  type: typeof SET_USED_FREE_PLAN;
  payload: boolean;
}

export type PlanActionTypes =
  | GetPlanAction
  | SetPlanAction
  | SetUsedFreePlanAction;

export const getPlan = (): GetPlanAction => ({
  type: GET_PLAN,
});

export const setPlan = (payload?: Plan): SetPlanAction => ({
  type: SET_PLAN,
  payload,
});

export const setUsedFreePlan = (payload: boolean): SetUsedFreePlanAction => ({
  type: SET_USED_FREE_PLAN,
  payload,
});
