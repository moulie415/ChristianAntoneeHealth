import {RouteProp} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import Profile from '../Profile';
import {SavedTest} from '../SavedItem';

type TestResultsRouteProp = RouteProp<StackParamList, 'TestResults'>;

type TestResultsNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'TestResults'
>;

export default interface TestResultsProp {
  route: TestResultsRouteProp;
  profile: Profile;
  saveTestAction: (test: SavedTest) => void;
  navigation: TestResultsNavigationProp;
};
