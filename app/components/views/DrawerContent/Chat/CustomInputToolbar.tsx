import React from 'react';
import {Dimensions, View} from 'react-native';
import {
  IMessage,
  InputToolbar,
  InputToolbarProps,
} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/FontAwesome6';
import CustomSend from './CustomSend';
import * as _ from 'lodash';

interface Props extends InputToolbarProps<IMessage> {
  text: string;
}

const CustomInputToolbar: React.FC<Props> = props => {
  return (
    <InputToolbar
      {...props}
      containerStyle={[
        props.containerStyle,
        {
          marginHorizontal: 20,
          borderRadius: 30,
        },
      ]}
      
    />
  );
};

export default CustomInputToolbar;
