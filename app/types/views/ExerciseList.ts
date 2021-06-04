import {RouteProp} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';
import Exercise from '../Exercise';
import {Goal, Level, StrengthArea} from '../Shared';

type ExerciseListNavigationProp = StackNavigationProp<
  StackParamList,
  'ExerciseList'
>;
type ExerciseListRouteProp = RouteProp<StackParamList, 'ExerciseList'>;

export default interface ExerciseListProps {
  exercises: {[key: string]: Exercise};
  navigation: ExerciseListNavigationProp;
  route: ExerciseListRouteProp;
  getExercisesAction: (
    level: Level,
    goals: Goal[],
    area?: StrengthArea,
  ) => void;
  workout: Exercise[];
  setWorkoutAction: (workout: Exercise[]) => void;
};
