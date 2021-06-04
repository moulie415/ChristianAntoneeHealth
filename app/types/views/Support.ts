import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../App';

type SupportNavigationProp = StackNavigationProp<StackParamList, 'Support'>;

export default interface SupportProps {
  navigation: SupportNavigationProp;
}
