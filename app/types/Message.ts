import {IMessage} from 'react-native-gifted-chat';

export type MessageType = 'text' | 'workout' | 'image' | 'video' | 'audio';

export default interface Message extends IMessage {
  type: MessageType;
  workout?: string[];
  id?: string;
};
