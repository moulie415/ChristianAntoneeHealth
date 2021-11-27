import {call, put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import Snackbar from 'react-native-snackbar';
import {
  AddExerciseAction,
  ADD_EXERCISE,
  DeleteExerciseAction,
  DELETE_EXERCISE,
  GetExercisesAction,
  GetExercisesByIdAction,
  GET_EXERCISES,
  GET_EXERCISES_BY_ID,
  GET_SAVED_WORKOUTS,
  SaveWorkoutAction,
  SAVE_WORKOUT,
  setExercises,
  setLoading,
  setSavedWorkouts,
  UpdateExerciseAction,
  UPDATE_EXERCISE,
} from '../actions/exercises';
import Exercise from '../types/Exercise';
import * as api from '../helpers/api';
import {MyRootState} from '../types/Shared';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {SavedWorkout} from '../types/SavedItem';

export function* getExercises(action: GetExercisesAction) {
  const {level, goal, area, cardioType} = action.payload;
  yield put(setLoading(true));
  const exercises: {[key: string]: Exercise} = yield call(
    api.getExercises,
    level,
    goal,
    area,
    cardioType,
  );
  yield put(setExercises(exercises));
  yield put(setLoading(false));
}

export function* deleteExercise(action: DeleteExerciseAction) {
  const id = action.payload;
  yield call(api.deleteExercise, id);
  const {exercises} = yield select((state: MyRootState) => state.exercises);
  delete exercises[id];
  yield put(setExercises(exercises));
  Snackbar.show({text: 'Exercise deleted'});
}

export function* addExercise(action: AddExerciseAction) {
  const exercise = action.payload;
  const ref: FirebaseFirestoreTypes.DocumentReference = yield call(
    api.addExercise,
    exercise,
  );
  const {id} = ref;
  const {exercises} = yield select((state: MyRootState) => state.exercises);

  yield put(setExercises({...exercises, [id]: exercise}));
  Snackbar.show({text: 'Exercise added'});
}

export function* updateExercise(action: UpdateExerciseAction) {
  const exercise = action.payload;
  yield call(api.updateExercise, exercise);
  // const exercises = { ...getState().exercises.exercises, [exercise.id]: exercise };
  // dispatch(setExercises(exercises));
  Snackbar.show({text: 'Exercise updated'});
}

export function* saveWorkout(action: SaveWorkoutAction) {
  try {
    const {uid} = yield select((state: MyRootState) => state.profile.profile);
    yield call(api.saveWorkout, action.payload, uid);
    yield call(Snackbar.show, {text: 'Workout saved'});
  } catch (e) {
    yield call(Snackbar.show, {text: 'Error saving workout'});
  }
}

function* getSavedWorkouts() {
  try {
    const {uid} = yield select((state: MyRootState) => state.profile.profile);
    yield put(setLoading(true));
    const workouts: {[key: string]: SavedWorkout} = yield call(
      api.getSavedWorkouts,
      uid,
    );
    yield put(setSavedWorkouts(workouts));
    yield put(setLoading(false));
  } catch (e) {
    yield put(setLoading(false));
    Snackbar.show({text: 'Error getting saved workouts'});
  }
}

function* getExercisesById(action: GetExercisesByIdAction) {
  try {
    const ids = action.payload;
    yield put(setLoading(true));
    if (ids.length) {
      const exercises: {[key: string]: Exercise} = yield call(
        api.getExercisesById,
        ids,
      );

      yield put(setExercises(exercises));
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(setLoading(false));
    console.log(e);
    Snackbar.show({text: 'Error fetching exercises'});
  }
}

export default function* exercisesSaga() {
  yield takeEvery(GET_EXERCISES, getExercises);
  yield takeEvery(ADD_EXERCISE, addExercise);
  yield takeEvery(DELETE_EXERCISE, deleteExercise);
  yield takeEvery(UPDATE_EXERCISE, updateExercise);
  yield takeLatest(SAVE_WORKOUT, saveWorkout);
  yield takeLatest(GET_SAVED_WORKOUTS, getSavedWorkouts);
  yield takeLatest(GET_EXERCISES_BY_ID, getExercisesById);
}
