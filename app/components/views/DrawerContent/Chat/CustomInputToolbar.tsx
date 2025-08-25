import React from 'react';
import { Platform } from 'react-native';
import {
  IMessage,
  InputToolbar,
  InputToolbarProps,
} from 'react-native-gifted-chat';
import VoiceNoteRecorder from './VoiceNoteRecorder';

interface Props extends InputToolbarProps<IMessage> {
  text: string;
  showRecorder: boolean;
  onCloseRecorder: () => void;
  onSendVoiceNote: (result: string) => void;
}

const CustomInputToolbar: React.FC<Props> = props => {
  if (props.showRecorder) {
    return (
      <VoiceNoteRecorder
        onSend={props.onSendVoiceNote}
        onClose={props.onCloseRecorder}
      />
    );
  }
  return (
    <InputToolbar
      {...props}
      containerStyle={[
        props.containerStyle,
        {
          marginHorizontal: 20,
          borderRadius: 30,
          marginBottom: Platform.OS === 'ios' ? 0 : 10,
        },
      ]}
    />
  );
};

export default CustomInputToolbar;
