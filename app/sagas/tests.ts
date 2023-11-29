import Snackbar from 'react-native-snackbar';
import {
  takeEvery,
  call,
  put,
  takeLatest,
  select,
  throttle,
} from 'redux-saga/effects';
import {setLoading} from '../actions/exercises';
import {
  GetTestsByIdAction,
  GET_SAVED_TESTS,
  GET_TESTS,
  GET_TESTS_BY_ID,
  SaveTestAction,
  SAVE_TEST,
  setSavedTests,
  setTests,
} from '../actions/tests';
import * as api from '../helpers/api';
import {SavedTest} from '../types/SavedItem';
import {MyRootState} from '../types/Shared';
import Test from '../types/Test';
import {logError} from '../helpers/error';

export function* getTests() {
  const tests: {[key: string]: Test} = yield call(api.getTests);
  yield put(setTests(tests));
}

function* saveTest(action: SaveTestAction) {
  try {
    const {uid} = yield select((state: MyRootState) => state.profile.profile);
    yield call(api.saveTest, action.payload, uid);
    if (action.payload.saved) {
      yield call(Snackbar.show, {text: 'Test saved'});
    }
  } catch (e) {
    logError(e);
    yield call(Snackbar.show, {text: 'Error saving test'});
  }
}

function* getSavedTests() {
  try {
    yield put(setLoading(true));
    const {uid} = yield select((state: MyRootState) => state.profile.profile);

    const savedTests: {[key: string]: SavedTest} = yield call(
      api.getSavedTests,
      uid,
    );
    yield put(setSavedTests(savedTests));
    const tests: {[key: string]: Test} = yield select(
      (state: MyRootState) => state.tests.tests,
    );
    const missingTests = Object.values(savedTests)
      .filter(test => !tests[test.testId])
      .map(test => test.testId);
    if (missingTests.length) {
      yield call(getTestsById, {payload: missingTests, type: GET_TESTS_BY_ID});
    }
    yield put(setLoading(false));
  } catch (e) {
    logError(e);
    yield put(setLoading(false));
    Snackbar.show({text: 'Error getting saved tests'});
  }
}

function* getTestsById(action: GetTestsByIdAction) {
  try {
    const ids = action.payload;
    yield put(setLoading(true));
    if (ids.length) {
      const tests: {[key: string]: Test} = yield call(api.getTestsById, ids);
      yield put(setTests(tests));
    }
    yield put(setLoading(false));
  } catch (e) {
    logError(e);
    yield put(setLoading(false));
    Snackbar.show({text: 'Error fetching tests'});
  }
}

export default function* testsSaga() {
  yield throttle(5000, GET_TESTS, getTests);
  yield throttle(5000, SAVE_TEST, saveTest);
  yield throttle(5000, GET_SAVED_TESTS, getSavedTests);
  yield throttle(5000, GET_TESTS_BY_ID, getTestsById);
}
