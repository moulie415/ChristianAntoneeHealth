import QuickRoutine from '../types/QuickRoutines';
import {SavedQuickRoutine} from '../types/SavedItem';
import {SetLoggedInAction} from './profile';

export const GET_QUICK_ROUTINES = 'GET_QUICK_ROUTINES';
export const GET_QUICK_ROUTINES_BY_ID = 'GET_QUICK_ROUTINES_BY_ID';
export const SET_QUICK_ROUTINES = 'SET_QUICK_ROUTINES';
export const SAVE_QUICK_ROUTINE = 'SAVE_QUICK_ROUTINE';
export const GET_SAVED_QUICK_ROUTINES = 'GET_SAVED_QUICK_ROUTINES';
export const SET_SAVED_QUICK_ROUTINES = 'SET_SAVED_QUICK_ROUTINES';
export const START_QUICK_ROUTINE = 'START_QUICK_ROUTINE';

interface SetQuickRoutinesAction {
  type: typeof SET_QUICK_ROUTINES;
  quickRoutines: {[key: string]: QuickRoutine};
}

export interface GetTestsAction {
  type: typeof GET_QUICK_ROUTINES;
}

export interface GetQuickRoutinesByIdAction {
  type: typeof GET_QUICK_ROUTINES_BY_ID;
  payload: string[];
}

export interface StartQuickRoutineAction {
  type: typeof START_QUICK_ROUTINE;
  payload: QuickRoutine;
}

export const setQuickRoutines = (quickRoutines: {
  [key: string]: QuickRoutine;
}): SetQuickRoutinesAction => ({
  type: SET_QUICK_ROUTINES,
  quickRoutines,
});

export const getQuickRoutines = (): GetTestsAction => ({
  type: GET_QUICK_ROUTINES,
});

export const getQuickRoutinesById = (
  ids: string[],
): GetQuickRoutinesByIdAction => ({
  type: GET_QUICK_ROUTINES_BY_ID,
  payload: ids,
});

export interface SaveQuickRoutineAction {
  type: typeof SAVE_QUICK_ROUTINE;
  payload: SavedQuickRoutine;
}

export interface GetSavedQuickRoutinesAction {
  type: typeof GET_SAVED_QUICK_ROUTINES;
}

export interface SetSavedQuickRoutinesAction {
  type: typeof SET_SAVED_QUICK_ROUTINES;
  payload: {[key: string]: SavedQuickRoutine};
}

export const saveQuickRoutine = (
  payload: SavedQuickRoutine,
): SaveQuickRoutineAction => ({
  type: SAVE_QUICK_ROUTINE,
  payload,
});

export const getSavedQuickRoutines = (): GetSavedQuickRoutinesAction => ({
  type: GET_SAVED_QUICK_ROUTINES,
});

export const setSavedQuickRoutine = (savedQuickRoutines: {
  [key: string]: SavedQuickRoutine;
}): SetSavedQuickRoutinesAction => ({
  type: SET_SAVED_QUICK_ROUTINES,
  payload: savedQuickRoutines,
});

export const startQuickRoutine = (
  payload: QuickRoutine,
): StartQuickRoutineAction => ({
  payload,
  type: START_QUICK_ROUTINE,
});

export type QuickRoutinesActions =
  | SetQuickRoutinesAction
  | SaveQuickRoutineAction
  | GetSavedQuickRoutinesAction
  | SetSavedQuickRoutinesAction
  | GetQuickRoutinesByIdAction
  | SetLoggedInAction;
