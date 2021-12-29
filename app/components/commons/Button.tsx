import React from 'react';
import {Button as UIButton, ButtonProps} from '@ui-kitten/components';

const Button: React.FC<ButtonProps> = ({children, ...props}) => {
  return <UIButton {...props}>{children}</UIButton>;
};

export default Button;
