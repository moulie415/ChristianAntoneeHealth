import React from 'react';
import {Button as UIButton, ButtonProps} from '@ui-kitten/components';
import colors from '../../constants/colors';

const Button: React.FC<ButtonProps> = ({children, ...props}) => {
  return (
    <UIButton
      {...props}
      style={[
        {
          ...(props.disabled ? {} : {backgroundColor: colors.appBlue}),
        },
        props.style,
      ]}>
      {children}
    </UIButton>
  );
};

export default Button;
