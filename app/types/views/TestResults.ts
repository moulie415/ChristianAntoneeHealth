import {RouteProp} from '@react-navigation/core';
import {StackParamList} from '../../App';
import Profile from '../Profile';

type TestResultsRouteProp = RouteProp<StackParamList, 'TestResults'>;

export default interface TestResultsProp {
  route: TestResultsRouteProp;
  profile: Profile;
};
