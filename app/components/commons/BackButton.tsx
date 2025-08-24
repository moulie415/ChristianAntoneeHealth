import {FontAwesome6} from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import colors from '../../constants/colors';

const BackButton: React.FC<TouchableOpacityProps> = props => {
  return (
    <TouchableOpacity
      {...props}
      style={[
        {
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
        },
        props.style,
      ]}>
      <FontAwesome6
        name="chevron-left"
        color={colors.appWhite}
        size={25}
        style={{marginLeft: -3}}
        iconStyle="solid"
      />
    </TouchableOpacity>
  );
};

export default BackButton;
