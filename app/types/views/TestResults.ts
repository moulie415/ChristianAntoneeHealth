import {RouteProp} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';
import Profile from '../Profile';
import {SavedTest} from '../SavedItem';

type TestResultsRouteProp = RouteProp<StackParamList, 'TestResults'>;

type TestResultsNavigationProp = StackNavigationProp<
  StackParamList,
  'TestResults'
>;

export default interface TestResultsProp {
  route: TestResultsRouteProp;
  profile: Profile;
  saveTestAction: (test: SavedTest) => void;
  navigation: TestResultsNavigationProp;
};
