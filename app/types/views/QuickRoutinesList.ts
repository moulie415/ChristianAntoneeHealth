import {RouteProp} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';
import QuickRoutine from '../QuickRoutines';

type QuickRoutinesListRouteProp = RouteProp<StackParamList, 'QuickRoutines'>;

export type QuickRoutinesListNavigationProp = StackNavigationProp<
  StackParamList,
  'QuickRoutines'
>;

export default interface QuickRoutinesListProps {
  route: QuickRoutinesListRouteProp;
  quickRoutines: {[key: string]: QuickRoutine};
  navigation: QuickRoutinesListNavigationProp;
}
