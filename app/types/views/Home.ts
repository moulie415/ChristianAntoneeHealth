import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';
import Profile from '../Profile';

type HomeNavigationProp = StackNavigationProp<StackParamList, 'Home'>;

export default interface HomeProps {
  navigation: HomeNavigationProp;
  profile: Profile;
  hasViewedWelcome: boolean;
}
