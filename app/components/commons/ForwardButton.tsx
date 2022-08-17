import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DevicePixels from '../../helpers/DevicePixels';
import colors from '../../constants/colors';

const ForwardButton: React.FC<TouchableOpacityProps> = props => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        width: DevicePixels[40],
        height: DevicePixels[40],
        borderRadius: DevicePixels[20],
        alignItems: 'center',
        justifyContent: 'center',
      }}
      {...props}>
      <Icon
        name="chevron-right"
        color={colors.appWhite}
        size={DevicePixels[25]}
        style={{marginRight: -DevicePixels[3]}}
      />
    </TouchableOpacity>
  );
};

export default ForwardButton;
