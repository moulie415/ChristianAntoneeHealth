import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import DevicePixels from '../../helpers/DevicePixels';

const BackButton: React.FC<TouchableOpacityProps> = props => {
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
        name="chevron-left"
        color={colors.appWhite}
        size={DevicePixels[25]}
        style={{marginLeft: -DevicePixels[3]}}
      />
    </TouchableOpacity>
  );
};

export default BackButton;
