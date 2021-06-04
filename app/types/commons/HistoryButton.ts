import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../App';

export default interface HistoryButtonProps {
  onPress?: () => void;
  navigation: StackNavigationProp<StackParamList, 'Tabs'>;
}
