import {
  QuickRoutinesActions,
  SET_QUICK_ROUTINES,
} from '../actions/quickRoutines';
import QuickRoutine from '../types/QuickRoutines';

export interface QuickRoutinesState {
  quickRoutines: {[key: string]: QuickRoutine};
  videos: {[key: string]: {src: string; path: string}};
  videoLoading: boolean;
}

const initialState: QuickRoutinesState = {
  quickRoutines: {},
  videos: {},
  videoLoading: false,
};

const reducer = (
  state = initialState,
  action: QuickRoutinesActions,
): QuickRoutinesState => {
  switch (action.type) {
    case SET_QUICK_ROUTINES:
      return {
        ...state,
        quickRoutines: action.quickRoutines,
      };
    default:
      return state;
  }
};
export default reducer;
