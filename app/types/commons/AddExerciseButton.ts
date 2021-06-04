import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../App';

type AddExerciseButtonNavigationProp = StackNavigationProp<StackParamList, 'ExerciseList'>;

export default interface AddExerciseButtonProps {
  navigation: AddExerciseButtonNavigationProp;
}
