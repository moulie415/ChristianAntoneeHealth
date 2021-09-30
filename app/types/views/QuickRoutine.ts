import {RouteProp} from '@react-navigation/core';
import {StackParamList} from '../../App';

type QuickRoutinesRouteProp = RouteProp<StackParamList, 'QuickRoutine'>;

export default interface QuickRoutineProps {
  downloadVideoAction: (id: string) => void;
  videos: {[key: string]: {src: string; path: string}};
  loading: boolean;
  route: QuickRoutinesRouteProp;
}
