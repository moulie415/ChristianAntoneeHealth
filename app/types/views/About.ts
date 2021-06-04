import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../App';

type AboutNavigationProp = StackNavigationProp<StackParamList, 'About'>;

export default interface AboutProps {
  navigation: AboutNavigationProp;
}
