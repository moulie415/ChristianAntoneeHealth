import {RouteProp} from '@react-navigation/core';
import {StackParamList} from '../../App';
import Profile from '../Profile';
import Test from '../Test';

type TestRouteProp = RouteProp<StackParamList, 'Test'>;

export default interface TestProps {
  tests: {[key: string]: Test};
  route: TestRouteProp;
  profile: Profile;
};
