import {NavigationProp, RouteProp} from '@react-navigation/core';
import {StackParamList} from '../../App';
import Profile from '../Profile';
import Test from '../Test';

type TestRouteProp = RouteProp<StackParamList, 'Test'>;
type TestNavigationProp = NavigationProp<StackParamList, 'Test'>;

export default interface TestProps {
  tests: {[key: string]: Test};
  route: TestRouteProp;
  navigation: TestNavigationProp;
  profile: Profile;
}
