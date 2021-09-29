import {takeEvery, call, put} from 'redux-saga/effects';
import {GET_QUICK_ROUTINES, setQuickRoutines} from '../actions/quickRoutines';
import * as api from '../helpers/api';
import QuickRoutine from '../types/QuickRoutines';

export function* getQuickRoutines() {
  console.log('test')
  const tests: {[key: string]: QuickRoutine} = yield call(api.getQuickRoutines);
  yield put(setQuickRoutines(tests));
}

export default function* quickRoutinesSaga() {
  yield takeEvery(GET_QUICK_ROUTINES, getQuickRoutines);
}
