import Snackbar from 'react-native-snackbar';
import {takeEvery, call, put, takeLatest, select} from 'redux-saga/effects';
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

export function* getTests() {
  const tests: {[key: string]: Test} = yield call(api.getTests);
  yield put(setTests(tests));
}

function* saveTest(action: SaveTestAction) {
  try {
    const {uid} = yield select((state: MyRootState) => state.profile.profile);
    yield call(api.saveTest, action.payload, uid);
    yield call(Snackbar.show, {text: 'Test saved '});
  } catch (e) {
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
    yield put(setLoading(false));
  } catch (e) {
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
    yield put(setLoading(false));
    Snackbar.show({text: 'Error fetching tests'});
  }
}

export default function* testsSaga() {
  yield takeLatest(GET_TESTS, getTests);
  yield takeLatest(SAVE_TEST, saveTest);
  yield takeLatest(GET_SAVED_TESTS, getSavedTests);
  yield takeLatest(GET_TESTS_BY_ID, getTestsById);
}
