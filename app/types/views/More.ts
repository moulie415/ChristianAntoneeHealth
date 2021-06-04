import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';
import Profile from '../Profile';

type MoreNavigationProp = StackNavigationProp<StackParamList, 'More'>;

export default interface moreProps {
  navigation: MoreNavigationProp;
  setLoggedInAction: (loggedIn: boolean) => void;
  profile: Profile;
}
