import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';
import Profile from '../Profile';

type ProfileNavigationProp = StackNavigationProp<StackParamList, 'Profile'>;

export default interface ProfileProps {
  navigation: ProfileNavigationProp;
  profile: Profile;
};
