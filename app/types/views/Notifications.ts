import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../App';

type NotificationsNavigationProp = StackNavigationProp<StackParamList, 'Notifications'>;

export default interface NotificationsProps {
  navigation: NotificationsNavigationProp;
}
