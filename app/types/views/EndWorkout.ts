import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';

type EndWorkoutNavigationProp = StackNavigationProp<
  StackParamList,
  'EndWorkout'
>;

type EndWorkoutRouteProp = RouteProp<StackParamList, 'EndWorkout'>;

export default interface EndWorkoutProps {
  navigation: EndWorkoutNavigationProp;
  route: EndWorkoutRouteProp;
}
