import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import Exercise from '../Exercise';
import Profile from '../Profile';

type ReviewExercisesNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'ReviewExercises'
>;

export default interface ReviewExercisesProps {
  workout: Exercise[];
  setWorkoutAction: (workout: Exercise[]) => void;
  navigation: ReviewExercisesNavigationProp;
  profile: Profile;
};
