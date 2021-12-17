import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import Profile from '../Profile';

type MoreNavigationProp = NativeStackNavigationProp<StackParamList, 'More'>;

export default interface moreProps {
  navigation: MoreNavigationProp;
  setLoggedInAction: (loggedIn: boolean) => void;
  profile: Profile;
};
