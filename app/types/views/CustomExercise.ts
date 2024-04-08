import {RouteProp} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import Exercise from '../Exercise';
import {Profile} from '../Shared';

type CustomizeExerciseRouteProp = RouteProp<
  StackParamList,
  'CustomizeExercise'
>;

type CustomizeExerciseNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'CustomizeExercise'
>;

export default interface CustomizeExerciseProps {
  route: CustomizeExerciseRouteProp;
  workout: Exercise[];
  setWorkoutAction: (workout: Exercise[]) => void;
  navigation: CustomizeExerciseNavigationProp;
  videos: {[key: string]: {src: string; path: string}};
  loading: boolean;
  profile: Profile;
}
