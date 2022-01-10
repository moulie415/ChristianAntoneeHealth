import Exercise from '../types/Exercise';
import {SavedWorkout} from '../types/SavedItem';
import {
  CardioType,
  CoolDown,
  Equipment,
  Goal,
  Level,
  StrengthArea,
  WarmUp,
} from '../types/Shared';

export const GET_EXERCISES = 'GET_EXERCISES';
export const GET_EXERCISES_BY_ID = 'GET_EXERCISES_BY_ID';
export const SET_EXERCISES = 'SET_EXERCISES';
export const ADD_EXERCISE = 'ADD_EXERCISE';
export const DELETE_EXERCISE = 'DELETE_EXERCISE';
export const UPDATE_EXERCISE = 'UPDATE_EXERCISE';
export const SET_LOADING = 'SET_LOADING';
export const SET_WORKOUT = 'SET_WORKOUT';
export const SET_EXERCISE_NOTE = 'SET_EXERCISE_NOTE';
export const SET_WORKOUT_NOTE = 'SET_WORKOUT_NOTE';
export const DOWNLOAD_VIDEO = 'DOWNLOAD_VIDEO';
export const SET_VIDEO = 'SET_VIDEO';
export const SET_VIDEO_LOADING = 'VIDEO_LOADING';
export const SAVE_WORKOUT = 'SAVED_WORKOUT';
export const GET_SAVED_WORKOUTS = 'GET_SAVED_WORKOUTS';
export const SET_SAVED_WORKOUTS = 'SET_SAVED_WORKOUTS';
export const SET_FITNESS_GOAL = 'SET_FITNESS_GOAL';
export const SET_STRENGTH_AREA = 'SET_STRENGTH_AREA';
export const SET_CARDIO_TYPE = 'SET_CARDIO_TYPE';
export const SET_LEVEL = 'SET_LEVEL';
export const SET_EQUIPMENT = 'SET_EQUIPMENT';
export const SET_WARM_UP = 'SET_WARMUP';
export const SET_COOL_DOWN = 'SET_COOLDOWN';

export interface GetExercisesAction {
  type: typeof GET_EXERCISES;
  payload: {
    level: Level;
    goal: Goal;
    area: StrengthArea;
    cardioType: CardioType;
    coolDown: CoolDown[];
    warmUp: WarmUp[];
  };
}

export interface GetExercisesByIdAction {
  type: typeof GET_EXERCISES_BY_ID;
  payload: string[];
}

export interface AddExerciseAction {
  type: typeof ADD_EXERCISE;
  payload: Exercise;
}

export interface DeleteExerciseAction {
  type: typeof DELETE_EXERCISE;
  payload: string;
}

export interface UpdateExerciseAction {
  type: typeof UPDATE_EXERCISE;
  payload: Exercise;
}
export interface SetExercisesAction {
  type: typeof SET_EXERCISES;
  exercises: {[key: string]: Exercise};
}

export interface SetLoadingAction {
  type: typeof SET_LOADING;
  loading: boolean;
}

export interface SetWorkoutAction {
  type: typeof SET_WORKOUT;
  payload: Exercise[];
}

export interface SetExerciseNoteAction {
  type: typeof SET_EXERCISE_NOTE;
  payload: {exercise: string; note: string};
}

export interface SetWorkoutNoteAction {
  type: typeof SET_WORKOUT_NOTE;
  payload: {workout: string; note: string};
}

export interface DownloadVideoAction {
  type: typeof DOWNLOAD_VIDEO;
  payload: string;
}

export interface SetVideoLoadingAction {
  type: typeof SET_VIDEO_LOADING;
  payload: boolean;
}

export interface SetVideoAction {
  type: typeof SET_VIDEO;
  payload: {id: string; src: string; path: string};
}

export interface SaveWorkoutAction {
  type: typeof SAVE_WORKOUT;
  payload: SavedWorkout;
}

export interface GetSavedWorkoutsAction {
  type: typeof GET_SAVED_WORKOUTS;
}

export interface SetSavedWorkoutsAction {
  type: typeof SET_SAVED_WORKOUTS;
  payload: {[key: string]: SavedWorkout};
}

export interface SetFitnessGoalAction {
  type: typeof SET_FITNESS_GOAL;
  payload: Goal;
}

export interface SetStrengthAreaAction {
  type: typeof SET_STRENGTH_AREA;
  payload: StrengthArea;
}

export interface SetCardioTypeAction {
  type: typeof SET_CARDIO_TYPE;
  payload: CardioType;
}

export interface SetLevelAction {
  type: typeof SET_LEVEL;
  payload: Level;
}

export interface SetEquipmentAction {
  type: typeof SET_EQUIPMENT;
  payload: Equipment[];
}

export interface SetWarmUpAction {
  type: typeof SET_WARM_UP;
  payload: WarmUp[];
}

export interface SetCoolDownAction {
  type: typeof SET_COOL_DOWN;
  payload: CoolDown[];
}

export const getExercises = (
  level: Level,
  goal: Goal,
  area: StrengthArea,
  cardioType: CardioType,
  warmUp: WarmUp[],
  coolDown: CoolDown[],
): GetExercisesAction => ({
  type: GET_EXERCISES,
  payload: {level, goal, area, cardioType, warmUp, coolDown},
});

export const getExercisesById = (ids: string[]): GetExercisesByIdAction => ({
  type: GET_EXERCISES_BY_ID,
  payload: ids,
});

export const addExercise = (exercise: Exercise): AddExerciseAction => ({
  type: ADD_EXERCISE,
  payload: exercise,
});
export const deleteExercise = (id: string): DeleteExerciseAction => ({
  type: DELETE_EXERCISE,
  payload: id,
});
export const updateExercise = (exercise: Exercise): UpdateExerciseAction => ({
  type: UPDATE_EXERCISE,
  payload: exercise,
});

export const setExercises = (exercises: {
  [key: string]: Exercise;
}): SetExercisesAction => ({
  type: SET_EXERCISES,
  exercises,
});

export const setLoading = (loading: boolean): SetLoadingAction => ({
  type: SET_LOADING,
  loading,
});

export const setWorkout = (payload: Exercise[]): SetWorkoutAction => ({
  type: SET_WORKOUT,
  payload,
});

export const setExerciseNote = (
  exercise: string,
  note: string,
): SetExerciseNoteAction => ({
  type: SET_EXERCISE_NOTE,
  payload: {exercise, note},
});

export const downloadVideo = (id: string): DownloadVideoAction => ({
  type: DOWNLOAD_VIDEO,
  payload: id,
});

export const setVideo = (
  id: string,
  src: string,
  path: string,
): SetVideoAction => ({
  type: SET_VIDEO,
  payload: {id, src, path},
});

export const setVideoLoading = (payload: boolean): SetVideoLoadingAction => ({
  type: SET_VIDEO_LOADING,
  payload,
});

export const saveWorkout = (payload: SavedWorkout): SaveWorkoutAction => ({
  type: SAVE_WORKOUT,
  payload,
});

export const getSavedWorkouts = (): GetSavedWorkoutsAction => ({
  type: GET_SAVED_WORKOUTS,
});

export const setSavedWorkouts = (savedWorkouts: {
  [key: string]: SavedWorkout;
}): SetSavedWorkoutsAction => ({
  type: SET_SAVED_WORKOUTS,
  payload: savedWorkouts,
});

export const setFitnessGoal = (goal: Goal): SetFitnessGoalAction => ({
  type: SET_FITNESS_GOAL,
  payload: goal,
});

export const setStrengthArea = (area: StrengthArea): SetStrengthAreaAction => ({
  type: SET_STRENGTH_AREA,
  payload: area,
});

export const setCardioType = (type: CardioType): SetCardioTypeAction => ({
  type: SET_CARDIO_TYPE,
  payload: type,
});

export const setLevel = (level: Level): SetLevelAction => ({
  type: SET_LEVEL,
  payload: level,
});

export const setEquipment = (equipment: Equipment[]): SetEquipmentAction => ({
  type: SET_EQUIPMENT,
  payload: equipment,
});

export const setWarmUp = (warmUp: WarmUp[]): SetWarmUpAction => ({
  type: SET_WARM_UP,
  payload: warmUp,
});

export const setCoolDown = (coolDown: CoolDown[]): SetCoolDownAction => ({
  type: SET_COOL_DOWN,
  payload: coolDown,
});

export type ExercisesActions =
  | SetExercisesAction
  | GetExercisesAction
  | SetWorkoutAction
  | SetExerciseNoteAction
  | SetWorkoutNoteAction
  | DownloadVideoAction
  | SetVideoAction
  | SetVideoLoadingAction
  | SetLoadingAction
  | SaveWorkoutAction
  | GetSavedWorkoutsAction
  | SetSavedWorkoutsAction
  | GetExercisesByIdAction
  | SetFitnessGoalAction
  | SetStrengthAreaAction
  | SetCardioTypeAction
  | SetLevelAction
  | SetEquipmentAction
  | SetWarmUpAction
  | SetCoolDownAction;
