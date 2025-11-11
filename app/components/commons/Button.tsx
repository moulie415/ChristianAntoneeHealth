import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import React, { ReactNode } from 'react';
import {
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import colors from '../../constants/colors';
import Spinner from './Spinner';
import Text from './Text';

interface Props extends TouchableOpacityProps {
  text: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  textStyle?: TextStyle;
  overrideCasing?: boolean;
  icon?: string | ReactNode;
  iconSize?: number;
  iconColor?: string;
  iconStyle?: string;
}

const Button: React.FC<Props> = ({
  text,
  loading,
  variant,
  textStyle,
  disabled,
  overrideCasing,
  icon,
  iconSize,
  iconColor,
  iconStyle,
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
          flexDirection: 'row',
          alignItems: 'center',
        },
        props.style,
      ]}
    >
      {!!icon && !loading && (
        <>
          {typeof icon === 'string' ? (
            <FontAwesome6
              name={icon as any}
              color={iconColor || colors.appWhite}
              size={iconSize || 20}
              style={{ marginRight: 10 }}
              iconStyle={(iconStyle as any) || 'solid'}
            />
          ) : (
            icon
          )}
        </>
      )}
      {loading ? (
        <Spinner />
      ) : (
        <Text
          style={[
            {
              color: variant === 'secondary' ? colors.appBlue : colors.appWhite,
              textAlign: 'center',
              fontSize: 14,
              textTransform: overrideCasing ? undefined : 'uppercase',
              fontWeight: 'bold',
            },
            textStyle,
          ]}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
