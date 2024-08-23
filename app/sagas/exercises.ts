import {PayloadAction} from '@reduxjs/toolkit';
import * as _ from 'lodash';
import moment from 'moment';
import {Alert} from 'react-native';
import Snackbar from 'react-native-snackbar';
import {
  all,
  call,
  debounce,
  fork,
  put,
  select,
  throttle,
} from 'redux-saga/effects';
import {RootState} from '../App';
import {navigate, resetToTabs} from '../RootNavigation';
import * as api from '../helpers/api';
import {logError} from '../helpers/error';
import {sendGoalTargetNotification} from '../helpers/goals';
import {
  GET_EXERCISES,
  GET_EXERCISES_BY_ID,
  GET_SAVED_WORKOUTS,
  SAVE_WORKOUT,
  VIEW_WORKOUT,
  setExercises,
  setLoading,
  setSavedWorkouts,
  setWorkout,
} from '../reducers/exercises';
import {ProfileState, updateProfile} from '../reducers/profile';
import {QuickRoutinesState} from '../reducers/quickRoutines';
import Exercise from '../types/Exercise';
import {SavedWorkout} from '../types/SavedItem';
import {CoolDown, Goal, Level, Profile, WarmUp} from '../types/Shared';
import {checkStepsCalories} from './leaderboards';
import {feedbackTrigger} from './profile';

export function* getExercises(
  action: PayloadAction<{
    level: Level;
    goal: Goal;
    warmUp: WarmUp[];
    coolDown: CoolDown[];
  }>,
) {
  const {level, goal, warmUp, coolDown} = action.payload;
  yield put(setLoading(true));
  const exercises: {[key: string]: Exercise} = yield call(
    api.getExercises,
    level,
    goal,
    warmUp,
    coolDown,
  );
  yield put(setExercises(exercises));
  yield put(setLoading(false));
}

export function* saveWorkout(action: PayloadAction<SavedWorkout>) {
  try {
    const {profile, weeklyItems}: ProfileState = yield select(
      (state: RootState) => state.profile,
    );

    yield call(api.saveWorkout, action.payload, profile.uid);
    if (action.payload.saved) {
      yield call(Snackbar.show, {text: 'Workout saved'});
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
    yield fork(checkStepsCalories);
    yield call(feedbackTrigger);
  } catch (e) {
    logError(e);
    yield call(Snackbar.show, {text: 'Error saving workout'});
  }
}

export function* incrementWorkoutStreak() {
  try {
    const {dailyWorkoutStreak, lastWorkoutDate}: Profile = yield select(
      (state: RootState) => state.profile.profile,
    );
    if (!lastWorkoutDate || !moment(lastWorkoutDate).isSame(moment(), 'day')) {
      yield put(
        updateProfile({
          dailyWorkoutStreak: dailyWorkoutStreak ? dailyWorkoutStreak + 1 : 1,
          lastWorkoutDate: new Date().toISOString(),
          disableSnackbar: true,
        }),
      );
    }
  } catch (e) {
    logError(e);
  }
}

export function* checkWorkoutStreak() {
  try {
    const {dailyWorkoutStreak, lastWorkoutDate}: Profile = yield select(
      (state: RootState) => state.profile.profile,
    );
    if (
      dailyWorkoutStreak &&
      moment().diff(moment(lastWorkoutDate).endOf('day'), 'day', true) >= 1
    ) {
      yield put(
        updateProfile({
          dailyWorkoutStreak: 0,
          disableSnackbar: true,
        }),
      );
    }
  } catch (e) {
    logError(e);
  }
}

function* getSavedWorkouts(action: PayloadAction<Date | undefined>) {
  const {profile}: ProfileState = yield select(
    (state: RootState) => state.profile,
  );
  if (profile.premium) {
    try {
      yield put(setLoading(true));
      const {uid} = yield select((state: RootState) => state.profile.profile);
      const workouts: {[key: string]: SavedWorkout} = yield call(
        api.getSavedWorkouts,
        uid,
        action.payload,
      );
      yield put(setSavedWorkouts(workouts));
      const exercises: {[key: string]: Exercise} = yield select(
        (state: RootState) => state.exercises.exercises,
      );
      const missingExercises = Object.values(workouts).reduce(
        (acc: string[], cur) => {
          const missing = cur.workout.filter(exercise => !exercises[exercise]);
          return [...acc, ...missing];
        },
        [],
      );

      if (missingExercises.length) {
        yield call(getExercisesById, {
          payload: missingExercises,
          type: GET_EXERCISES_BY_ID,
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

export function* getExercisesById(action: PayloadAction<string[]>) {
  try {
    const ids = _.uniq(action.payload);
    yield put(setLoading(true));
    if (ids.length) {
      if (ids.length > 10) {
        const exercises: {[key: string]: Exercise} = yield call(
          api.getAllExercises,
        );
        yield put(setExercises(exercises));
      } else {
        const exercises: {[key: string]: Exercise} = yield call(
          api.getExercisesById,
          ids,
        );
        yield put(setExercises(exercises));
      }
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(setLoading(false));
    logError(e);
    Snackbar.show({text: 'Error fetching exercises'});
  }
}

export function* getAllExercises() {
  try {
    yield put(setLoading(true));
    const exercises: {[key: string]: Exercise} = yield call(
      api.getAllExercises,
    );
    yield put(setExercises(exercises));
  } catch (e) {
    logError(e);
    Snackbar.show({text: 'Error fetching exercises'});
  }
  yield put(setLoading(false));
}

export function* viewWorkoutWatcher(action: PayloadAction<string[]>) {
  try {
    yield put(setLoading(true));
    const ids = action.payload;
    const exercises: {[key: string]: Exercise} = yield select(
      (state: RootState) => state.exercises.exercises,
    );
    const {premium, admin} = yield select(
      (state: RootState) => state.profile.profile,
    );
    const missing = ids.filter(id => {
      return !exercises[id];
    });
    if (missing.length) {
      yield call(getExercisesById, {
        type: GET_EXERCISES_BY_ID,
        payload: missing,
      });
    }
    const updatedExercises: {[key: string]: Exercise} = yield select(
      (state: RootState) => state.exercises.exercises,
    );
    const filtered = Object.values(updatedExercises).filter(exercise =>
      ids.includes(exercise.id || ''),
    );

    if (filtered.some(exercise => exercise.premium) && !premium && !admin) {
      resetToTabs();
      yield put(setLoading(false));
      Alert.alert(
        'Sorry',
        'That workout link includes premium exercises, would you like to subscribe to premium?',
        [
          {text: 'No thanks'},
          {text: 'Yes', onPress: () => navigate('Premium', {})},
        ],
      );
    } else {
      yield put(setLoading(false));
      yield put(setWorkout(filtered));
      resetToTabs();
      navigate('ReviewExercises');
    }
  } catch (e) {
    resetToTabs();
    Snackbar.show({text: 'Error fetching exercises'});
    yield put(setLoading(false));
    logError(e);
  }
}

export default function* exercisesSaga() {
  yield all([
    throttle(5000, GET_EXERCISES, getExercises),
    throttle(5000, SAVE_WORKOUT, saveWorkout),
    debounce(500, GET_SAVED_WORKOUTS, getSavedWorkouts),
    throttle(5000, GET_EXERCISES_BY_ID, getExercisesById),
    throttle(5000, VIEW_WORKOUT, viewWorkoutWatcher),
  ]);
}
