import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../App';

type PremiumNavigationProp = StackNavigationProp<StackParamList, 'Premium'>;

export default interface PremiumProps {
  navigation: PremiumNavigationProp;
}
