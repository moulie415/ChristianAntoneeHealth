import React from 'react';
import {TouchableOpacity} from 'react-native';
import {ActionsProps} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/FontAwesome6';
import colors from '../../../../constants/colors';

interface Props extends ActionsProps {
  onPressCamera: () => void;
  disabled: boolean;
}

const ChatActions: React.FC<Props> = props => {
  if (props.disabled) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={props.onPressCamera}
      style={{
        marginLeft: 5,
        alignSelf: 'center',
        height: 35,
        width: 35,
        borderRadius: 18,
        backgroundColor: colors.appBlue,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Icon name="camera" size={20} color={colors.appWhite} />
    </TouchableOpacity>
  );
};

export default ChatActions;
