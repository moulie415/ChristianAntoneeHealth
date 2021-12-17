import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';

type AboutNavigationProp = NativeStackNavigationProp<StackParamList, 'About'>;

export default interface AboutProps {
  navigation: AboutNavigationProp;
}
