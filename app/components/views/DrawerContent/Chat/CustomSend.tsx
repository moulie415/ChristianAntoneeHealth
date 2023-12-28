import React from 'react';
import {IMessage, Send, SendProps} from 'react-native-gifted-chat';

const CustomSend: React.FC<SendProps<IMessage>> = props => {
  
  return <Send {...props} />;
};

export default CustomSend;
