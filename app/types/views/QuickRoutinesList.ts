import {RouteProp} from '@react-navigation/core';
import {TopTabsParamsList} from '../../App';
import QuickRoutine from '../QuickRoutines';

type QuickRoutinesListRouteProp = RouteProp<TopTabsParamsList, 'FullBody'>;

export default interface QuickRoutinesListProps {
  route: QuickRoutinesListRouteProp;
  quickRoutines: {[key: string]: QuickRoutine};
};
