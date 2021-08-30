import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';
import Exercise from '../Exercise';
import Profile from '../Profile';

type EndWorkoutNavigationProp = StackNavigationProp<
  StackParamList,
  'EndWorkout'
>;

type EndWorkoutRouteProp = RouteProp<StackParamList, 'EndWorkout'>;

export default interface EndWorkoutProps {
  navigation: EndWorkoutNavigationProp;
  route: EndWorkoutRouteProp;
  profile: Profile;
  workout: Exercise[];
};
