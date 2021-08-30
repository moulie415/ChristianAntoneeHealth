import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';

type WelcomeNavigationProp = StackNavigationProp<StackParamList, 'Welcome'>;

export default interface WelcomeProps {
  navigation: WelcomeNavigationProp;
};
