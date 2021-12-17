import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import Exercise from '../Exercise';
import Profile from '../Profile';

type EndWorkoutNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'EndWorkout'
>;

type EndWorkoutRouteProp = RouteProp<StackParamList, 'EndWorkout'>;

export default interface EndWorkoutProps {
  navigation: EndWorkoutNavigationProp;
  route: EndWorkoutRouteProp;
  profile: Profile;
  workout: Exercise[];
}
