import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import Exercise from '../Exercise';
import Profile from '../Profile';

type EndQuickRoutineNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'EndQuickRoutine'
>;

type EndQuickRoutineRouteProp = RouteProp<StackParamList, 'EndQuickRoutine'>;

export default interface EndQuickRoutineProps {
  navigation: EndQuickRoutineNavigationProp;
  route: EndQuickRoutineRouteProp;
  profile: Profile;
  workout: Exercise[];
}
