import Education from '../types/Education';

export const GET_EDUCATION = 'GET_EDUCATION';
export const SET_EDUCATION = 'SET_EDUCATION';
export const SET_EDUCATION_LOADING = 'SET_EDUCATION_LOADING';

export interface GetEducationAction {
  type: typeof GET_EDUCATION;
}

export interface SetEducationAction {
  type: typeof SET_EDUCATION;
  payload: {[key: string]: Education};
}

export interface SetEducationLoadingAction {
  type: typeof SET_EDUCATION_LOADING;
  payload: boolean;
}

export const getEducation = (): GetEducationAction => ({
  type: GET_EDUCATION,
});

export const setEducation = (education: {
  [key: string]: Education;
}): SetEducationAction => ({
  type: SET_EDUCATION,
  payload: education,
});

export const setEducationLoading = (
  loading: boolean,
): SetEducationLoadingAction => ({
  type: SET_EDUCATION_LOADING,
  payload: loading,
});

export type EducationActions =
  | GetEducationAction
  | SetEducationAction
  | SetEducationLoadingAction;
