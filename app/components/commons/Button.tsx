import React from 'react';
import colors from '../../constants/colors';
import {
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Text from './Text';
import DevicePixels from '../../helpers/DevicePixels';
import Spinner from './Spinner';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface Props extends TouchableOpacityProps {
  text: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  textStyle?: TextStyle;
}

const Button: React.FC<Props> = ({
  text,
  loading,
  variant,
  textStyle,
  disabled,
  ...props
}) => {
  const gradient = () => {
    // if (disabled) {
    //   return [colors.appGrey, colors.appGrey];
    // }
    if (variant === 'secondary') {
      return [colors.appWhite, colors.appWhite];
    }
    if (variant === 'danger') {
      return [colors.appRed, colors.appRed];
    }
    return [colors.appBlueLight, colors.appBlueDark];
  };
  return (
    <TouchableOpacity
      {...props}
      disabled={disabled}
      style={[
        {
          borderRadius: DevicePixels[10],
          overflow: 'hidden',
        },
        props.style,
      ]}>
      <LinearGradient
        style={{
          height: DevicePixels[60],
          justifyContent: 'center',
          padding: DevicePixels[10],
          opacity: disabled ? 0.5 : 1,
        }}
        colors={gradient()}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        {loading ? (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Spinner />
          </View>
        ) : (
          <Text
            style={[
              {
                color:
                  variant === 'secondary' ? colors.appBlue : colors.appWhite,
                textAlign: 'center',
                fontSize: DevicePixels[20],
              },
              textStyle,
            ]}>
            {text}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Button;
