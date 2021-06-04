import Test from '../types/Test';

export const GET_TESTS = 'GET_TESTS';
export const SET_TESTS = 'SET_TESTS';

interface SetTestsAction {
  type: typeof SET_TESTS;
  tests: {[key: string]: Test};
}

export interface GetTestsAction {
  type: typeof GET_TESTS;
}

export const setTests = (tests: {[key: string]: Test}): SetTestsAction => ({
  type: SET_TESTS,
  tests,
});

export const getTests = (): GetTestsAction => ({
  type: GET_TESTS,
});

export type TestsActions = SetTestsAction;
