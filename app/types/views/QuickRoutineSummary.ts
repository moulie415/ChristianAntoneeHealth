import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';
import Profile from '../Profile';
import {SavedQuickRoutine} from '../SavedItem';

type QuickRoutineNavigationProp = StackNavigationProp<
  StackParamList,
  'QuickRoutineSummary'
>;

type QuickRoutineRouteProp = RouteProp<StackParamList, 'WorkoutSummary'>;

export default interface QuickRoutineSummaryProps {
  navigation: QuickRoutineNavigationProp;
  route: QuickRoutineRouteProp;
  profile: Profile;
  saveQuickRoutineAction: (quickRoutine: SavedQuickRoutine) => void;
};
