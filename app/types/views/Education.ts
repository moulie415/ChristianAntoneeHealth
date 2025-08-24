import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';

type EducationNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'Education'
>;

export default interface EducationProps {
  navigation: EducationNavigationProp;
}
