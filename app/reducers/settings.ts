import {SettingsActions, SET_SETTINGS} from '../actions/settings';
import {Goal, Level} from '../types/Shared';

export interface SettingsWorkoutGoal {
  mins: number;
  calories: number;
  workouts: {
    level: Level;
    number: number;
  };
}

export interface SettingsState {
  ads: boolean;
  admins: string[];
  workoutGoals: {[key in Goal]?: SettingsWorkoutGoal};
}

const initialState: SettingsState = {
  ads: true,
  admins: [],
  workoutGoals: {
    weightLoss: {
      calories: 3500,
      mins: 180,
      workouts: {
        level: Level.INTERMEDIATE,
        number: 4,
      },
    },
    active: {
      calories: 3500,
      mins: 150,
      workouts: {
        level: Level.INTERMEDIATE,
        number: 5,
      },
    },
    strength: {
      calories: 3500,
      mins: 150,
      workouts: {
        level: Level.INTERMEDIATE,
        number: 5,
      },
    },
  },
};

const reducer = (
  state = initialState,
  action: SettingsActions,
): SettingsState => {
  switch (action.type) {
    case SET_SETTINGS:
      return action.payload;
    default:
      return state;
  }
};
export default reducer;
