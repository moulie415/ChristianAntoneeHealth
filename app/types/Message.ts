import {IMessage} from 'react-native-gifted-chat';

export default interface Message extends IMessage {
  type: 'text' | 'workout';
}
