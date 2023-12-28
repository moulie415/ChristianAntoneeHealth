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

const WIDTH = Dimensions.get('window').width;

interface Props extends InputToolbarProps<IMessage> {
  text: string;
}

const CustomInputToolbar: React.FC<Props> = props => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        marginHorizontal: 20,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        width: props.text ? WIDTH - 100 : WIDTH - 40,
        height: 50,
      }}
      renderSend={CustomSend}
      primaryStyle={{width: WIDTH - 100}}
      renderAccessory={props => <Icon name="paperclip" />}
      accessoryStyle={{height: 50, width: 50}}
    />
  );
};

export default CustomInputToolbar;
