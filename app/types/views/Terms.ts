import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../../App';

type TermsNavigationProp = NativeStackNavigationProp<StackParamList, 'Terms'>;

export default interface TermsProps {
  navigation: TermsNavigationProp;
}
