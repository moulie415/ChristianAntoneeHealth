import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import colors from '../../constants/colors';

interface Props extends TouchableOpacityProps {
  icon: string;
}
const IconButton: React.FC<Props> = ({ icon, ...props }) => {
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
      ]}
    >
      <FontAwesome6
        iconStyle="solid"
        name={icon as any}
        color={colors.appWhite}
        size={20}
      />
    </TouchableOpacity>
  );
};

export default IconButton;
