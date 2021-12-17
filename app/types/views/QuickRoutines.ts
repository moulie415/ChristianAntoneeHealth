import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';

type QuickRoutinesNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'QuickRoutines'
>;

export default interface QuickRoutinesProps {
  navigation: QuickRoutinesNavigationProp;
  getQuickRoutinesAction: () => void;
};
