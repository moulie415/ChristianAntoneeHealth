import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../App';

type TermsNavigationProp = StackNavigationProp<StackParamList, 'Terms'>;

export default interface TermsProps {
  navigation: TermsNavigationProp;
}
