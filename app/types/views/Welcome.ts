import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';

type WelcomeNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'Welcome'
>;

export default interface WelcomeProps {
  navigation: WelcomeNavigationProp;
}
