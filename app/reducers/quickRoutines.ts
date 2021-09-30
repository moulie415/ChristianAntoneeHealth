import {
  QuickRoutinesActions,
  SET_QUICK_ROUTINES,
  SET_ROUTINE_VIDEO,
  SET_ROUTINE_VIDEO_LOADING,
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
    case SET_ROUTINE_VIDEO:
      return {
        ...state,
        videos: {
          ...state.videos,
          [action.payload.id]: {
            src: action.payload.src,
            path: action.payload.path,
          },
        },
      };
    case SET_ROUTINE_VIDEO_LOADING:
      return {
        ...state,
        videoLoading: action.payload,
      };
    default:
      return state;
  }
};
export default reducer;
