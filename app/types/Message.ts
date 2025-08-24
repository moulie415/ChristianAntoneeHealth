import {IMessage} from 'react-native-gifted-chat';

export type MessageType =
  | 'text'
  | 'workout'
  | 'image'
  | 'video'
  | 'audio'
  | 'document';

export default interface Message extends IMessage {
  type: MessageType;
  workout?: string[];
  id?: string;
  document?: string;
  mimeType?: string;
  filename?: string;
}
