import React, {ReactNode, useState} from 'react';
import {TextInput, TouchableOpacity, View, ViewStyle} from 'react-native';
import {TextInputProps} from 'react-native';
import colors from '../../constants/colors';

import Icon from 'react-native-vector-icons/FontAwesome5';

interface Props extends TextInputProps {
  secure?: boolean;
  containerStyle?: ViewStyle;
  disabled?: boolean;
  accessoryRight?: ReactNode;
  ref?: any;
}

const Input: React.FC<Props> = props => {
  const [secure, setSecure] = useState(props.secure);

  return (
    <View style={props.containerStyle}>
      <TextInput
        {...props}
        secureTextEntry={secure}
        editable={!props.disabled}
        placeholderTextColor={colors.appWhite}
        style={[
          {
            borderColor: colors.appWhite,
            height: 70,
            borderWidth: 2,
            borderRadius: 20,
            fontFamily: 'MontserratAlternates-Regular',
            color: colors.appWhite,
            padding: 20,
            paddingTop: props.multiline ? 10 : 20,
          },
          props.style,
        ]}
      />
      {props.secure !== undefined && (
        <View
          style={{
            position: 'absolute',
            height: 70,
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
              color={colors.appWhite}
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

            height: 70,
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
