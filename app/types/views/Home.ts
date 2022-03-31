import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import Profile from '../Profile';

type HomeNavigationProp = NativeStackNavigationProp<StackParamList, 'Home'>;

export default interface HomeProps {
  navigation: HomeNavigationProp;
  profile: Profile;
};
