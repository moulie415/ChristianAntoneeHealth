import {
  SET_EXERCISES,
  ExercisesActions,
  SET_WORKOUT,
  SET_EXERCISE_NOTE,
  SET_VIDEO,
  SET_VIDEO_LOADING,
  SET_LOADING,
  SET_SAVED_WORKOUTS,
  SET_FITNESS_GOAL,
  SET_STRENGTH_AREA,
  SET_CARDIO_TYPE,
  SET_LEVEL,
  SET_EQUIPMENT,
  SET_WARM_UP,
  SET_COOL_DOWN,
} from '../actions/exercises';
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

export interface ExercisesState {
  exercises: {[key: string]: Exercise};
  loading: boolean;
  workout: Exercise[];
  fitnessGoal: Goal;
  strengthArea: StrengthArea;
  cardioType: CardioType;
  level: Level;
  equipment: Equipment[];
  warmUp: WarmUp[];
  coolDown: CoolDown[];
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
  fitnessGoal: Goal.STRENGTH,
  strengthArea: StrengthArea.UPPER,
  cardioType: CardioType.HIT,
  level: Level.BEGINNER,
  equipment: [Equipment.NONE],
  warmUp: [],
  coolDown: [],
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
    case SET_FITNESS_GOAL:
      return {
        ...state,
        fitnessGoal: action.payload,
      };
    case SET_STRENGTH_AREA:
      return {
        ...state,
        strengthArea: action.payload,
      };
    case SET_CARDIO_TYPE:
      return {
        ...state,
        cardioType: action.payload,
      };
    case SET_LEVEL:
      return {
        ...state,
        level: action.payload,
      };
    case SET_EQUIPMENT:
      return {
        ...state,
        equipment: action.payload,
      };
    case SET_WARM_UP:
      return {
        ...state,
        warmUp: action.payload,
      };
    case SET_COOL_DOWN:
      return {
        ...state,
        coolDown: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
