import React from 'react';
import {View} from 'react-native';
import {
  IMessage,
  InputToolbar,
  InputToolbarProps,
} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/FontAwesome6';

const CustomInputToolbar: React.FC<InputToolbarProps<IMessage>> = props => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{marginHorizontal: 20, borderRadius: 30}}
      renderAccessory={props => <Icon name="paperclip" />}
    />
  );
};

export default CustomInputToolbar;
