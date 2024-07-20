import {PayloadAction} from '@reduxjs/toolkit';
import Snackbar from 'react-native-snackbar';
import {call, debounce, fork, put, select, throttle} from 'redux-saga/effects';
import {RootState} from '../App';
import * as api from '../helpers/api';
import {logError} from '../helpers/error';
import {sendGoalTargetNotification} from '../helpers/goals';
import {setLoading} from '../reducers/exercises';
import {ProfileState} from '../reducers/profile';
import {
  GET_QUICK_ROUTINES,
  GET_QUICK_ROUTINES_BY_ID,
  GET_SAVED_QUICK_ROUTINES,
  QuickRoutinesState,
  SAVE_QUICK_ROUTINE,
  setQuickRoutines,
  setSavedQuickRoutines,
} from '../reducers/quickRoutines';
import QuickRoutine from '../types/QuickRoutines';
import {SavedQuickRoutine} from '../types/SavedItem';
import {incrementWorkoutStreak} from './exercises';
import {feedbackTrigger} from './profile';

export function* getQuickRoutines() {
  try {
    const routines: {[key: string]: QuickRoutine} = yield call(
      api.getQuickRoutines,
    );
    yield put(setQuickRoutines(routines));
  } catch (e) {
    logError(e);
  }
}

function* saveQuickRoutine(action: PayloadAction<SavedQuickRoutine>) {
  try {
    const {profile, weeklyItems}: ProfileState = yield select(
      (state: RootState) => state.profile,
    );
    yield call(api.saveQuickRoutine, action.payload, profile.uid);
    if (action.payload.saved) {
      yield call(Snackbar.show, {text: 'Workout saved '});
    }
    if (profile.goal) {
      const {quickRoutines}: QuickRoutinesState = yield select(
        (state: RootState) => state.quickRoutines,
      );

      sendGoalTargetNotification(
        action.payload,
        weeklyItems,
        quickRoutines,
        profile,
      );
    }

    yield fork(incrementWorkoutStreak);
    yield call(feedbackTrigger);
  } catch (e) {
    logError(e);
    yield call(Snackbar.show, {text: 'Error saving workout'});
  }
}

export function* getSavedQuickRoutines(
  action: PayloadAction<Date | undefined>,
) {
  const {profile}: ProfileState = yield select(
    (state: RootState) => state.profile,
  );
  if (profile.premium) {
    try {
      yield put(setLoading(true));
      const {uid} = yield select((state: RootState) => state.profile.profile);
      const savedQuickRoutines: {[key: string]: SavedQuickRoutine} = yield call(
        api.getSavedQuickRoutines,
        uid,
        action.payload,
      );
      yield put(setSavedQuickRoutines(savedQuickRoutines));
      const quickRoutines: {[key: string]: QuickRoutine} = yield select(
        (state: RootState) => state.quickRoutines.quickRoutines,
      );
      const missingRoutines = Object.values(savedQuickRoutines)
        .filter(routine => !quickRoutines[routine.quickRoutineId])
        .map(routine => routine.quickRoutineId);

      if (missingRoutines.length) {
        yield call(getQuickRoutinesById, {
          payload: missingRoutines,
          type: GET_QUICK_ROUTINES_BY_ID,
        });
      }
      yield put(setLoading(false));
    } catch (e) {
      logError(e);
      yield put(setLoading(false));
      Snackbar.show({text: 'Error getting saved workouts'});
    }
  }
}

function* getQuickRoutinesById(action: PayloadAction<string[]>) {
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
    logError(e);
    yield put(setLoading(false));
    Snackbar.show({text: 'Error fetching workouts'});
  }
}

export default function* quickRoutinesSaga() {
  yield throttle(5000, GET_QUICK_ROUTINES, getQuickRoutines);
  yield throttle(5000, SAVE_QUICK_ROUTINE, saveQuickRoutine);
  yield debounce(500, GET_SAVED_QUICK_ROUTINES, getSavedQuickRoutines);
  yield throttle(5000, GET_QUICK_ROUTINES_BY_ID, getQuickRoutinesById);
}
