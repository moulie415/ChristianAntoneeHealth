import {Plan} from '../types/Shared';

export const GET_PLAN = 'GET_PLAN';
export const SET_PLAN = 'SET_PLAN';

export interface GetPlanAction {
  type: typeof GET_PLAN;
}

export interface SetPlanAction {
  type: typeof SET_PLAN;
  payload: Plan;
}

export type PlanActionTypes = GetPlanAction | SetPlanAction;

export type PlanActions = GetPlanAction | SetPlanAction;

export const getPlan = (): GetPlanAction => ({
  type: GET_PLAN,
});

export const setPlan = (payload: Plan): SetPlanAction => ({
  type: SET_PLAN,
  payload,
});
