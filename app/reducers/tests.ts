import Test from '../types/Test';
import {SET_SAVED_TESTS, SET_TESTS, TestsActions} from '../actions/tests';
import {SavedTest} from '../types/SavedItem';
import {SET_LOGGED_IN} from '../actions/profile';

export interface TestsState {
  tests: {[key: string]: Test};
  savedTests: {[key: string]: SavedTest};
}

const initialState: TestsState = {
  tests: {},
  savedTests: {},
};

const reducer = (state = initialState, action: TestsActions): TestsState => {
  switch (action.type) {
    case SET_TESTS:
      return {
        ...state,
        tests: action.tests,
      };
    case SET_SAVED_TESTS:
      return {
        ...state,
        savedTests: {...state.savedTests, ...action.payload},
      };
    case SET_LOGGED_IN:
      return action.payload ? state : initialState;
    default:
      return state;
  }
};
export default reducer;
