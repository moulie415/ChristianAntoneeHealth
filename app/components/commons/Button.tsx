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

import Spinner from './Spinner';
import Icon from 'react-native-vector-icons/FontAwesome6';

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
  return (
    <TouchableOpacity
      {...props}
      disabled={disabled}
      style={[
        {
          borderRadius: 12,
          overflow: 'hidden',
          height: 50,
          justifyContent: 'center',
          padding: 10,
          opacity: disabled ? 0.5 : 1,
          backgroundColor:
            variant === 'secondary'
              ? 'transparent'
              : variant === 'danger'
              ? colors.appRed
              : colors.appBlue,
          borderWidth: variant === 'secondary' ? 2 : 0,
          borderColor: colors.appBlue,
        },
        props.style,
      ]}>
      {loading ? (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Spinner />
        </View>
      ) : (
        <Text
          style={[
            {
              color: variant === 'secondary' ? colors.appBlue : colors.appWhite,
              textAlign: 'center',
              fontSize: 14,
              textTransform: 'uppercase',
              fontWeight: 'bold',
            },
            textStyle,
          ]}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
