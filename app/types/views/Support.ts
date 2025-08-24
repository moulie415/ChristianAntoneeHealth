import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';

type SupportNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'Support'
>;

export default interface SupportProps {
  navigation: SupportNavigationProp;
}
