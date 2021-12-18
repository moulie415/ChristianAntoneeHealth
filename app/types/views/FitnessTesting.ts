import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import Profile from '../Profile';
import Test from '../Test';

type FitnessTestingNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'Fitness'
>;

export default interface FitnessTestingProps {
  navigation: FitnessTestingNavigationProp;
  tests: {[key: string]: Test};
  profile: Profile;
}
