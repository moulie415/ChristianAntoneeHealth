import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';
import Exercise from '../Exercise';
import Profile from '../Profile';

type WorkoutNavigationProp = StackNavigationProp<StackParamList, 'Workout'>;

export default interface WorkoutProps {
  navigation: WorkoutNavigationProp;
  setWorkoutAction: (workout: Exercise[]) => void;
  profile: Profile;
}
