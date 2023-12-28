import React, {ReactNode, useState} from 'react';
import {TextInput, TouchableOpacity, View, ViewStyle} from 'react-native';
import {TextInputProps} from 'react-native';
import colors from '../../constants/colors';

import Icon from 'react-native-vector-icons/FontAwesome6';

interface Props extends TextInputProps {
  secure?: boolean;
  containerStyle?: ViewStyle;
  disabled?: boolean;
  accessoryRight?: ReactNode;
  ref?: any;
  icon?: string;
  iconSize?: number;
}

const Input: React.FC<Props> = props => {
  const [secure, setSecure] = useState(props.secure);

  const [focused, setFocused] = useState(false);

  return (
    <View style={props.containerStyle}>
      <TextInput
        {...props}
        secureTextEntry={secure}
        editable={!props.disabled}
        placeholderTextColor={'rgba(255, 255, 255, 0.50)'}
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        style={[
          {
            borderColor: focused ? colors.appBlue : colors.borderColor,
            height: 50,
            borderWidth: 1,
            borderRadius: 12,
            fontFamily: 'Helvetica',
            color: colors.appWhite,
            padding: 15,
            paddingTop: 15,
            backgroundColor: '#363944',
            paddingLeft: props.secure || props.icon ? 40 : 15,
          },
          props.style,
        ]}
      />
      {props.icon && (
        <View
          style={{
            position: 'absolute',
            height: 50,
            justifyContent: 'center',
            alignItems: 'flex-end',
            left: 0,
            width: 30,
          }}>
          <Icon
            name={props.icon}
            color={'#CECECE'}
            solid
            size={props.iconSize || 15}
          />
        </View>
      )}
      {props.secure !== undefined && (
        <View
          style={{
            position: 'absolute',
            height: 50,
            justifyContent: 'center',
            alignItems: 'flex-end',
            left: 0,
            width: 30,
          }}>
          <TouchableOpacity
            hitSlop={{
              top: 10,
              bottom: 10,
              right: 10,
              left: 10,
            }}
            onPress={() => setSecure(!secure)}>
            <Icon name="lock" color={'#CECECE'} size={15} />
          </TouchableOpacity>
        </View>
      )}
      {props.secure !== undefined && (
        <View
          style={{
            position: 'absolute',
            height: 50,
            justifyContent: 'center',
            alignItems: 'flex-end',
            right: 20,
            width: 30,
          }}>
          <TouchableOpacity
            hitSlop={{
              top: 10,
              bottom: 10,
              right: 10,
              left: 10,
            }}
            onPress={() => setSecure(!secure)}>
            <Icon
              name={secure ? 'eye' : 'eye-slash'}
              color={'#CECECE'}
              size={20}
            />
          </TouchableOpacity>
        </View>
      )}
      {!!props.accessoryRight && (
        <View
          style={{
            position: 'absolute',
            width: '100%',

            height: 50,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            right: 20,
          }}>
          {props.accessoryRight}
        </View>
      )}
    </View>
  );
};

export default Input;
