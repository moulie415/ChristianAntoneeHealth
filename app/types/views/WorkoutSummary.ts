import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';
import Exercise from '../Exercise';
import Profile from '../Profile';
import {SavedWorkout} from '../SavedItem';

type WorkoutSummaryNavigationProp = StackNavigationProp<
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
