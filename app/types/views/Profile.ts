import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {UpdateProfilePayload} from '../../actions/profile';
import {StackParamList} from '../../App';
import Profile from '../Profile';
import {Sample} from '../Shared';

type ProfileNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'Profile'
>;

export default interface ProfileProps {
 
}
