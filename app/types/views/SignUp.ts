import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

type SignUpNavigationProp = NativeStackNavigationProp<StackParamList, 'SignUp'>;

export default interface SignUpProps {
  navigation: SignUpNavigationProp;
  handleAuth: (user: FirebaseAuthTypes.User) => void;
};
