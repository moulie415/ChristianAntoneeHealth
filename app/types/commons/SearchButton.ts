import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../App';

export default interface SearchButtonProps {
  onPress?: () => void;
  navigation: StackNavigationProp<StackParamList, 'Tabs'>;
}
