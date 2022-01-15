import {call, put, select, takeLatest} from 'redux-saga/effects';
import {
  GetQuickRoutinesByIdAction,
  GET_QUICK_ROUTINES,
  GET_QUICK_ROUTINES_BY_ID,
  GET_SAVED_QUICK_ROUTINES,
  SaveQuickRoutineAction,
  SAVE_QUICK_ROUTINE,
  setQuickRoutines,
  setSavedQuickRoutine,
} from '../actions/quickRoutines';
import * as api from '../helpers/api';
import QuickRoutine from '../types/QuickRoutines';
import {MyRootState} from '../types/Shared';
import Snackbar from 'react-native-snackbar';
import {SavedQuickRoutine} from '../types/SavedItem';
import {setLoading} from '../actions/exercises';

export function* getQuickRoutines() {
  const tests: {[key: string]: QuickRoutine} = yield call(api.getQuickRoutines);
  yield put(setQuickRoutines(tests));
}

function* saveQuickRoutine(action: SaveQuickRoutineAction) {
  try {
    const {uid} = yield select((state: MyRootState) => state.profile.profile);
    yield call(api.saveQuickRoutine, action.payload, uid);
    yield call(Snackbar.show, {text: 'Quick routine saved '});
  } catch (e) {
    yield call(Snackbar.show, {text: 'Error saving quick routine'});
  }
}

function* getSavedQuickRoutines() {
  try {
    yield put(setLoading(true));
    const {uid} = yield select((state: MyRootState) => state.profile.profile);
    const savedQuickRoutines: {[key: string]: SavedQuickRoutine} = yield call(
      api.getSavedQuickRoutines,
      uid,
    );
    yield put(setSavedQuickRoutine(savedQuickRoutines));
    yield put(setLoading(false));
  } catch (e) {
    console.log(e);
    yield put(setLoading(false));
    Snackbar.show({text: 'Error getting saved quick routines'});
  }
}

function* getQuickRoutinesById(action: GetQuickRoutinesByIdAction) {
  try {
    const ids = action.payload;
    yield put(setLoading(true));
    if (ids.length) {
      const routines: {[key: string]: QuickRoutine} = yield call(
        api.getQuickRoutinesById,
        ids,
      );
      yield put(setQuickRoutines(routines));
    }
    yield put(setLoading(false));
  } catch (e) {
    console.log(e);
    yield put(setLoading(false));
    Snackbar.show({text: 'Error fetching quick routines'});
  }
}

export default function* quickRoutinesSaga() {
  yield takeLatest(GET_QUICK_ROUTINES, getQuickRoutines);
  yield takeLatest(SAVE_QUICK_ROUTINE, saveQuickRoutine);
  yield takeLatest(GET_SAVED_QUICK_ROUTINES, getSavedQuickRoutines);
  yield takeLatest(GET_QUICK_ROUTINES_BY_ID, getQuickRoutinesById);
}
