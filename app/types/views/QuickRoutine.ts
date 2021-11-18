import {RouteProp} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';

type QuickRoutinesRouteProp = RouteProp<StackParamList, 'QuickRoutine'>;

type QuickRoutinesNavigationProp = StackNavigationProp<
  StackParamList,
  'QuickRoutine'
>;

export default interface QuickRoutineProps {
  downloadVideoAction: (id: string) => void;
  videos: {[key: string]: {src: string; path: string}};
  loading: boolean;
  route: QuickRoutinesRouteProp;
  navigation: QuickRoutinesNavigationProp;
}
