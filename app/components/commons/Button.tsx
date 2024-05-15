import React from 'react';
import {
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import colors from '../../constants/colors';
import Text from './Text';

import Spinner from './Spinner';

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
          backgroundColor:
            variant === 'secondary'
              ? 'transparent'
              : variant === 'danger'
              ? disabled
                ? colors.appRedOpacity
                : colors.appRed
              : disabled
              ? colors.appBlueOpacity
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
