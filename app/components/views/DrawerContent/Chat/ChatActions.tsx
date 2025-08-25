import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ActionsProps } from 'react-native-gifted-chat';

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
      }}
    >
      <FontAwesome6
        iconStyle="solid"
        name="camera"
        size={20}
        color={colors.appWhite}
      />
    </TouchableOpacity>
  );
};

export default ChatActions;
