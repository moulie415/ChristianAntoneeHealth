import {SET_LOGGED_IN} from '../actions/profile';
import {
  QuickRoutinesActions,
  SET_QUICK_ROUTINES,
  SET_SAVED_QUICK_ROUTINES,
} from '../actions/quickRoutines';
import QuickRoutine from '../types/QuickRoutines';
import {SavedQuickRoutine} from '../types/SavedItem';

export interface QuickRoutinesState {
  quickRoutines: {[key: string]: QuickRoutine};
  savedQuickRoutines: {[key: string]: SavedQuickRoutine};
}

const initialState: QuickRoutinesState = {
  quickRoutines: {},
  savedQuickRoutines: {},
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
    case SET_SAVED_QUICK_ROUTINES:
      return {
        ...state,
        savedQuickRoutines: {...state.savedQuickRoutines, ...action.payload},
      };
    case SET_LOGGED_IN:
      return action.payload ? state : initialState;
    default:
      return state;
  }
};
export default reducer;
