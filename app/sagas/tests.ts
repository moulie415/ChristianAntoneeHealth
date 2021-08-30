import {takeEvery, call, put} from 'redux-saga/effects';
import {GET_TESTS, setTests} from '../actions/tests';
import * as api from '../helpers/api';
import Test from '../types/Test';

export function* getTests() {
  const tests: {[key: string]: Test} = yield call(api.getTests);
  yield put(setTests(tests));
}

export default function* testsSaga() {
  yield takeEvery(GET_TESTS, getTests);
}
