import React from 'react';
import {Input as UIInput, InputProps} from '@ui-kitten/components';

const Input: React.FC<InputProps> = props => {
  return <UIInput {...props} />;
};

export default Input;
