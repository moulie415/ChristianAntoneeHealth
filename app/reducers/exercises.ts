import {
  SET_EXERCISES,
  ExercisesActions,
  SET_WORKOUT,
  SET_EXERCISE_NOTE,
} from '../actions/exercises';
import Exercise from '../types/Exercise';

export interface ExercisesState {
  exercises: {[key: string]: Exercise};
  workout: Exercise[];
  exerciseNotes: {[key: string]: string};
  workoutNotes: {[key: string]: string};
}

const initialState: ExercisesState = {
  exercises: {},
  workout: [],
  exerciseNotes: {},
  workoutNotes: {},
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
    default:
      return state;
  }
};

export default reducer;
