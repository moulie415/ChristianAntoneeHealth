import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../App';
import Test from '../Test';

type FitnessTestingNavigationProp = StackNavigationProp<StackParamList, 'FitnessTesting'>;

export default interface FitnessTestingProps {
  navigation: FitnessTestingNavigationProp;
  tests: { [key: string]: Test };
}
