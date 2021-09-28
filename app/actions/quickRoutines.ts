import QuickRoutine from '../types/QuickRoutines';

export const GET_QUICK_ROUTINES = 'GET_QUICK_ROUTINES';
export const SET_QUICK_ROUTINES = 'SET_QUICK_ROUTINES';

interface SetQuickRoutinesAction {
  type: typeof SET_QUICK_ROUTINES;
  quickRoutines: {[key: string]: QuickRoutine};
}

export interface GetTestsAction {
  type: typeof GET_QUICK_ROUTINES;
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

export type QuickRoutinesActions = SetQuickRoutinesAction;
