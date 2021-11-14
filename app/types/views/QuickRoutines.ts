import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';

type QuickRoutinesNavigationProp = StackNavigationProp<
  StackParamList,
  'QuickRoutines'
>;

export default interface QuickRoutinesProps {
  navigation: QuickRoutinesNavigationProp;
  getQuickRoutinesAction: () => void;
}
