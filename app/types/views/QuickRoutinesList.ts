import {RouteProp} from '@react-navigation/core';
import {StackParamList} from '../../App';
import QuickRoutine from '../QuickRoutines';

type QuickRoutinesListRouteProp = RouteProp<
  StackParamList,
  'QuickRoutinesList'
>;

export default interface QuickRoutinesListProps {
  route: QuickRoutinesListRouteProp;
  quickRoutines: {[key: string]: QuickRoutine};
  getQuickRoutinesAction: () => void;
}
