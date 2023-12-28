import React from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {IMessage, Send, SendProps} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/FontAwesome6';
import colors from '../../../../constants/colors';

interface Props extends SendProps<IMessage> {
  height: number;
}

const CustomSend: React.FC<Props> = props => {
  if (props.text) {
    return (
      <View
        style={{
          height: '100%',
          justifyContent: 'center',
        }}>
        <Send
          {...props}
          containerStyle={{marginHorizontal: 10}}
          textStyle={[props.textStyle, {color: colors.appBlue}]}
        />
      </View>
    );
  }
  return (
    <View
      style={{flexDirection: 'row', justifyContent: 'center', height: '100%'}}>
      <TouchableOpacity hitSlop={10} style={{padding: 10, alignSelf: 'center'}}>
        <Icon name="image" size={25} color={colors.appBlue} />
      </TouchableOpacity>
      <TouchableOpacity hitSlop={10} style={{padding: 10, alignSelf: 'center'}}>
        <Icon name="microphone" size={25} color={colors.appBlue} />
      </TouchableOpacity>
    </View>
  );
};

export default CustomSend;
