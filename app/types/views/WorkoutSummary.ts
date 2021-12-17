import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import Exercise from '../Exercise';
import Profile from '../Profile';
import {SavedWorkout} from '../SavedItem';

type WorkoutSummaryNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'WorkoutSummary'
>;

type WorkoutSummaryRouteProp = RouteProp<StackParamList, 'WorkoutSummary'>;

export default interface WorkoutSummaryProps {
  navigation: WorkoutSummaryNavigationProp;
  route: WorkoutSummaryRouteProp;
  profile: Profile;
  saveWorkoutAction: (workout: SavedWorkout) => void;
  workout: Exercise[];
}
