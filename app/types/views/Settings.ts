import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';

type SettingsNavigationProp = StackNavigationProp<StackParamList, 'Settings'>;

export default interface SettingsProps {
  navigation: SettingsNavigationProp;
}
