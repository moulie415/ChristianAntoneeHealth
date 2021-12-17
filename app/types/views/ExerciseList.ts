import {RouteProp} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import Exercise from '../Exercise';
import Profile from '../Profile';
import {CardioType, Goal, Level, StrengthArea} from '../Shared';

type ExerciseListNavigationProp = NativeStackNavigationProp<
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
    goal: Goal,
    area: StrengthArea,
    cardioType: CardioType,
  ) => void;
  workout: Exercise[];
  setWorkoutAction: (workout: Exercise[]) => void;
  loading: boolean;
  profile: Profile;
}
