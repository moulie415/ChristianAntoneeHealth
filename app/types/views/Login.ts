import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';

type LoginNavigationProp = StackNavigationProp<StackParamList, 'Login'>;

export default interface LoginProps {
  navigation: LoginNavigationProp;
  handleAuth: (user: FirebaseAuthTypes.User) => void;
}
