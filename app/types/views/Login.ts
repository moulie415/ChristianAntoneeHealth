import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';

type LoginNavigationProp = NativeStackNavigationProp<StackParamList, 'Login'>;

export default interface LoginProps {
  navigation: LoginNavigationProp;
  handleAuth: (user: FirebaseAuthTypes.User) => void;
};
