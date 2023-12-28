import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import colors from '../../constants/colors';

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
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          height: 40,
          width: 40,
        },
        props.style,
      ]}>
      <Icon name={icon} color={colors.appWhite} size={20} />
    </TouchableOpacity>
  );
};

export default IconButton;
