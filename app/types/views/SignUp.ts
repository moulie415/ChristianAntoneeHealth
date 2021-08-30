import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';

type SignUpNavigationProp = StackNavigationProp<StackParamList, 'SignUp'>;

export default interface SignUpProps {
  navigation: SignUpNavigationProp;
  setStep: (step: number) => void;
};
