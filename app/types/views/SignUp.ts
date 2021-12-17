import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';

type SignUpNavigationProp = NativeStackNavigationProp<StackParamList, 'SignUp'>;

export default interface SignUpProps {
  navigation: SignUpNavigationProp;
  setStep: (step: number) => void;
}
