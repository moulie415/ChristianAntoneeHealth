import Education from '../types/Education';
import {
  EducationActions,
  SET_EDUCATION,
  SET_EDUCATION_LOADING,
} from '../actions/education';
import {SET_LOGGED_IN} from '../actions/profile';

export interface EducationState {
  education: {[key: string]: Education};
  loading: boolean;
}

const initialState: EducationState = {
  education: {},
  loading: false,
};

const reducer = (
  state = initialState,
  action: EducationActions,
): EducationState => {
  switch (action.type) {
    case SET_EDUCATION:
      return {
        ...state,
        education: action.payload,
      };
    case SET_EDUCATION_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case SET_LOGGED_IN:
      return action.payload ? state : initialState;
    default:
      return state;
  }
};
export default reducer;
