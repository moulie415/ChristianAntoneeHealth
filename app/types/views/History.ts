import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../App';

type HistoryNavigationProp = StackNavigationProp<StackParamList, 'History'>;

export default interface HistoryProps {
  navigation: HistoryNavigationProp;
}
