import React from 'react';
import {TextInput} from 'react-native';
import {TextInputProps} from 'react-native';
import colors from '../../constants/colors';
import DevicePixels from '../../helpers/DevicePixels';

const Input: React.FC<TextInputProps> = props => {
  return (
    <TextInput
      {...props}
      style={[
        {
          borderColor: colors.appWhite,
          height: DevicePixels[70],
          borderWidth: DevicePixels[2],
          borderRadius: DevicePixels[20],
          fontFamily: 'MontserratAlternates-Regular',
          color: colors.appWhite,
        },
        props.style,
      ]}
    />
  );
};

export default Input;
