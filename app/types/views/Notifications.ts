import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';

type NotificationsNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'Notifications'
>;

export default interface NotificationsProps {
  navigation: NotificationsNavigationProp;
}
