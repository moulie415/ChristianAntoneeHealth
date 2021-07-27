import {
  SET_EXERCISES,
  ExercisesActions,
  SET_WORKOUT,
  SET_EXERCISE_NOTE,
  SET_VIDEO,
} from '../actions/exercises';
import Exercise from '../types/Exercise';

export interface ExercisesState {
  exercises: {[key: string]: Exercise};
  workout: Exercise[];
  exerciseNotes: {[key: string]: string};
  workoutNotes: {[key: string]: string};
  videos: {[key: string]: {src: string; path: string}};
}

const initialState: ExercisesState = {
  exercises: {},
  workout: [],
  exerciseNotes: {},
  workoutNotes: {},
  videos: {},
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
    default:
      return state;
  }
};

export default reducer;
