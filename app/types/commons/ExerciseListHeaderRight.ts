import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';
import Exercise from '../Exercise';

type ExerciseListNavigationProp = StackNavigationProp<
  StackParamList,
  'ExerciseList'
>;
export default interface ExerciseListHeaderRightProps {
  workout: Exercise[];
  navigation: ExerciseListNavigationProp;
}
