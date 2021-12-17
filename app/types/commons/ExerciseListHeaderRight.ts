import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import Exercise from '../Exercise';

type ExerciseListNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'ExerciseList'
>;
export default interface ExerciseListHeaderRightProps {
  workout: Exercise[];
  navigation: ExerciseListNavigationProp;
};
