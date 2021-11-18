import Snackbar from 'react-native-snackbar';
import {takeEvery, call, put, takeLatest} from 'redux-saga/effects';
import {GET_TESTS, SaveTestAction, SAVE_TEST, setTests} from '../actions/tests';
import * as api from '../helpers/api';
import Test from '../types/Test';

export function* getTests() {
  const tests: {[key: string]: Test} = yield call(api.getTests);
  yield put(setTests(tests));
}

function* saveTest(action: SaveTestAction) {
  try {
    yield call(api.saveTest, action.payload);
    yield call(Snackbar.show, {text: 'Test saved '});
  } catch (e) {
    yield call(Snackbar.show, {text: 'Error saving test'});
  }
}

export default function* testsSaga() {
  yield takeEvery(GET_TESTS, getTests);
  yield takeLatest(SAVE_TEST, saveTest);
}
