import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../App';

type EducationNavigationProp = StackNavigationProp<StackParamList, 'Education'>;

export default interface EducationProps {
  navigation: EducationNavigationProp;
}
