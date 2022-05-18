import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import Exercise from '../Exercise';
import Profile from '../Profile';

type StartWorkoutNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'StartWorkout'
>;

type StartWorkoutRouteProp = RouteProp<StackParamList, 'StartWorkout'>;

export default interface StartWorkoutProps {
  workout: Exercise[];
  setExerciseNoteAction: (exercise: string, note: string) => void;
  exerciseNotes: {[key: string]: string};
  navigation: StartWorkoutNavigationProp;
  route: StartWorkoutRouteProp;
  downloadVideoAction: (id: string) => void;
  videos: {[key: string]: {src: string; path: string}};
  loading: boolean;
  profile: Profile;
}
