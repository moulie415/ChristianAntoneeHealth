import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import Exercise from '../Exercise';
import Profile from '../Profile';

type WorkoutNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'Workout'
>;

export default interface WorkoutProps {
  navigation: WorkoutNavigationProp;
  setWorkoutAction: (workout: Exercise[]) => void;
  profile: Profile;
};
