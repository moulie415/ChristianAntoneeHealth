import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';

type LoginNavigationProp = StackNavigationProp<StackParamList, 'Login'>;

export default interface LoginProps {
  navigation: LoginNavigationProp;
};
