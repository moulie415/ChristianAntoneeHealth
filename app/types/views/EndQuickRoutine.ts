import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';
import Exercise from '../Exercise';
import Profile from '../Profile';

type EndQuickRoutineNavigationProp = StackNavigationProp<
  StackParamList,
  'EndQuickRoutine'
>;

type EndQuickRoutineRouteProp = RouteProp<StackParamList, 'EndQuickRoutine'>;

export default interface EndQuickRoutineProps {
  navigation: EndQuickRoutineNavigationProp;
  route: EndQuickRoutineRouteProp;
  profile: Profile;
  workout: Exercise[];
};
