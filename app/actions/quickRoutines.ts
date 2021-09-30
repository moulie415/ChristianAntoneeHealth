import QuickRoutine from '../types/QuickRoutines';

export const GET_QUICK_ROUTINES = 'GET_QUICK_ROUTINES';
export const SET_QUICK_ROUTINES = 'SET_QUICK_ROUTINES';
export const DOWNLOAD_ROUTINE_VIDEO = 'DOWNLOAD_ROUTINE_VIDEO';
export const SET_ROUTINE_VIDEO = 'SET_ROUTINE_VIDEO';
export const SET_ROUTINE_VIDEO_LOADING = 'SET_ROUTINE_VIDEO_LOADING';

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

export interface DownloadRoutineVideoAction {
  type: typeof DOWNLOAD_ROUTINE_VIDEO;
  payload: string;
}

export interface SetRoutineVideoLoadingAction {
  type: typeof SET_ROUTINE_VIDEO_LOADING;
  payload: boolean;
}

export interface SetRoutineVideoAction {
  type: typeof SET_ROUTINE_VIDEO;
  payload: {id: string; src: string; path: string};
}

export const downloadRoutineVideo = (
  id: string,
): DownloadRoutineVideoAction => ({
  type: DOWNLOAD_ROUTINE_VIDEO,
  payload: id,
});

export const setRoutineVideo = (
  id: string,
  src: string,
  path: string,
): SetRoutineVideoAction => ({
  type: SET_ROUTINE_VIDEO,
  payload: {id, src, path},
});

export const setRoutineVideoLoading = (
  payload: boolean,
): SetRoutineVideoLoadingAction => ({
  type: SET_ROUTINE_VIDEO_LOADING,
  payload,
});

export type QuickRoutinesActions =
  | SetQuickRoutinesAction
  | DownloadRoutineVideoAction
  | SetRoutineVideoAction
  | SetRoutineVideoLoadingAction;
