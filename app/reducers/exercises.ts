import {
  SET_EXERCISES,
  ExercisesActions,
  SET_WORKOUT,
  SET_EXERCISE_NOTE,
  SET_VIDEO,
  SET_VIDEO_LOADING,
  SET_LOADING,
  SET_SAVED_WORKOUTS,
} from '../actions/exercises';
import Exercise from '../types/Exercise';
import {SavedWorkout} from '../types/SavedItem';

export interface ExercisesState {
  exercises: {[key: string]: Exercise};
  loading: boolean;
  workout: Exercise[];
  exerciseNotes: {[key: string]: string};
  workoutNotes: {[key: string]: string};
  videos: {[key: string]: {src: string; path: string}};
  videoLoading: boolean;
  savedWorkouts: {[key: string]: SavedWorkout};
}

const initialState: ExercisesState = {
  loading: false,
  exercises: {},
  workout: [],
  exerciseNotes: {},
  workoutNotes: {},
  videos: {},
  savedWorkouts: {},
  videoLoading: false,
};

const reducer = (
  state = initialState,
  action: ExercisesActions,
): ExercisesState => {
  switch (action.type) {
    case SET_EXERCISES:
      return {
        ...state,
        exercises: {...state.exercises, ...action.exercises},
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.loading,
      };
    case SET_WORKOUT:
      return {
        ...state,
        workout: action.payload,
      };
    case SET_EXERCISE_NOTE:
      return {
        ...state,
        exerciseNotes: {
          ...state.exerciseNotes,
          [action.payload.exercise]: action.payload.note,
        },
      };
    case SET_VIDEO:
      return {
        ...state,
        videos: {
          ...state.videos,
          [action.payload.id]: {
            src: action.payload.src,
            path: action.payload.path,
          },
        },
      };
    case SET_VIDEO_LOADING:
      return {
        ...state,
        videoLoading: action.payload,
      };
    case SET_SAVED_WORKOUTS:
      return {
        ...state,
        savedWorkouts: {...state.savedWorkouts, ...action.payload},
      };
    default:
      return state;
  }
};

export default reducer;
