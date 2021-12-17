import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';

type PremiumNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'Premium'
>;

export default interface PremiumProps {
  navigation: PremiumNavigationProp;
  setPremiumAction: (premium: boolean) => void;
}
