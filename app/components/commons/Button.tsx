import React from 'react';
import colors from '../../constants/colors';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';

const Button: React.FC<TouchableOpacityProps> = ({children, ...props}) => {
  return (
    <TouchableOpacity
      {...props}
      style={[
        {
          ...(props.disabled ? {} : {backgroundColor: colors.appBlue}),
        },
        props.style,
      ]}>
      {children}
    </TouchableOpacity>
  );
};

export default Button;
