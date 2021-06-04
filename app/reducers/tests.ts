import Test from '../types/Test';
import {SET_TESTS, TestsActions} from '../actions/tests';

export interface TestsState {
  tests: {[key: string]: Test};
}

const initialState: TestsState = {
  tests: {},
};

const reducer = (state = initialState, action: TestsActions): TestsState => {
  switch (action.type) {
    case SET_TESTS:
      return {
        ...state,
        tests: action.tests,
      };
    default:
      return state;
  }
};
export default reducer;
