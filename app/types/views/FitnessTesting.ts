import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';
import Test from '../Test';

type FitnessTestingNavigationProp = StackNavigationProp<
  StackParamList,
  'Fitness'
>;

export default interface FitnessTestingProps {
  navigation: FitnessTestingNavigationProp;
  tests: {[key: string]: Test};
};
