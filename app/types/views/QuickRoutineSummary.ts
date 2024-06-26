import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import {Profile} from '../Shared';

type QuickRoutineNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'QuickRoutineSummary'
>;

type QuickRoutineRouteProp = RouteProp<StackParamList, 'QuickRoutineSummary'>;

export default interface QuickRoutineSummaryProps {
  navigation: QuickRoutineNavigationProp;
  route: QuickRoutineRouteProp;
  profile: Profile;
}
