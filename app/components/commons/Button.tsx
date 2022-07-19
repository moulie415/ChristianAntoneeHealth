import React from 'react';
import colors from '../../constants/colors';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Text from './Text';
import DevicePixels from '../../helpers/DevicePixels';

interface Props extends TouchableOpacityProps {
  text: string;
}

const Button: React.FC<Props> = ({text, ...props}) => {
  return (
    <TouchableOpacity
      {...props}
      style={[
        {
          ...(props.disabled ? {} : {backgroundColor: colors.appBlue}),
        },
        {borderRadius: DevicePixels[10], overflow: 'hidden'},
        props.style,
      ]}>
      <LinearGradient
        style={{
          height: DevicePixels[60],
          justifyContent: 'center',
        }}
        colors={['#1C74BB', '#2A3F94']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <Text
          style={{
            color: colors.appWhite,
            textAlign: 'center',
            fontSize: DevicePixels[15],
          }}>
          {text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Button;
