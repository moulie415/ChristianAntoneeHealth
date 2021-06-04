import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../App';
import { RouteProp } from '@react-navigation/native';
import Test from '../Test';

type TestResultNavigationProp = StackNavigationProp<StackParamList, 'TestResult'>;
type TestResultRouteProps = RouteProp<StackParamList, 'TestResult'>;

export default interface TestResultProps {
  navigation: TestResultNavigationProp;
  route: TestResultRouteProps;
  tests: { [key: string]: Test };
}
