import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';

type WorkoutSummaryNavigationProp = StackNavigationProp<
  StackParamList,
  'WorkoutSummary'
>;

type WorkoutSummaryRouteProp = RouteProp<StackParamList, 'WorkoutSummary'>;

export default interface WorkoutSummaryProps {
  navigation: WorkoutSummaryNavigationProp;
  route: WorkoutSummaryRouteProp;
};
