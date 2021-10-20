import {RouteProp} from '@react-navigation/core';
import {StackParamList} from '../../App';

type TestResultsRouteProp = RouteProp<StackParamList, 'TestResults'>;

export default interface TestResultsProp {
  route: TestResultsRouteProp;
};
