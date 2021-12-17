import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {UpdateProfilePayload} from '../../actions/profile';
import {StackParamList} from '../../App';
import Profile from '../Profile';
import {Sample} from '../Shared';

type ProfileNavigationProp = NativeStackNavigationProp<StackParamList, 'Profile'>;

export default interface ProfileProps {
  navigation: ProfileNavigationProp;
  profile: Profile;
  weightSamples: {[key: number]: Sample[]};
  updateProfileAction: (payload: UpdateProfilePayload) => void;
  getSamplesAction: () => void;
};
