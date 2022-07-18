import React from 'react';
import {TextInput} from 'react-native';
import {TextInputProps} from 'react-native';

const Input: React.FC<TextInputProps> = props => {
  return <TextInput {...props} />;
};

export default Input;
