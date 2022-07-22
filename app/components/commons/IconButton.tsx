import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import DevicePixels from '../../helpers/DevicePixels';

interface Props extends TouchableOpacityProps {
  icon: string;
}
const IconButton: React.FC<Props> = ({icon, ...props}) => {
  return (
    <TouchableOpacity
      {...props}
      style={[
        {
          backgroundColor: colors.appBlue,
          borderRadius: DevicePixels[10],
          justifyContent: 'center',
          alignItems: 'center',
          height: DevicePixels[40],
          width: DevicePixels[40],
        },
        props.style,
      ]}>
      <Icon name={icon} color={colors.appWhite} size={DevicePixels[20]} />
    </TouchableOpacity>
  );
};

export default IconButton;
