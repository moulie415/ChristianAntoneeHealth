import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../../App';
import QuickRoutine from '../QuickRoutines';

type QuickRoutinesListRouteProp = RouteProp<StackParamList, 'QuickRoutines'>;

export type QuickRoutinesListNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'QuickRoutines'
>;

export default interface QuickRoutinesListProps {
  route: QuickRoutinesListRouteProp;
  quickRoutines: { [key: string]: QuickRoutine };
  navigation: QuickRoutinesListNavigationProp;
}
