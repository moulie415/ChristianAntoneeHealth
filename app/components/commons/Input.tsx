import React, {useState} from 'react';
import {TextInput, TouchableOpacity, View, ViewStyle} from 'react-native';
import {TextInputProps} from 'react-native';
import colors from '../../constants/colors';
import DevicePixels from '../../helpers/DevicePixels';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface Props extends TextInputProps {
  secure?: boolean;
  containerStyle?: ViewStyle;
}

const Input: React.FC<Props> = props => {
  const [secure, setSecure] = useState(props.secure);
  return (
    <View style={props.containerStyle}>
      <TextInput
        {...props}
        secureTextEntry={secure}
        style={[
          {
            borderColor: colors.appWhite,
            height: DevicePixels[70],
            borderWidth: DevicePixels[2],
            borderRadius: DevicePixels[20],
            fontFamily: 'MontserratAlternates-Regular',
            color: colors.appWhite,
            padding: DevicePixels[20],
          },
          props.style,
        ]}
      />
      {props.secure !== undefined && (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: DevicePixels[70],
            justifyContent: 'center',
            alignItems: 'flex-end',
            right: DevicePixels[20],
          }}>
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Icon
              name={secure ? 'eye' : 'eye-slash'}
              color={colors.appWhite}
              size={DevicePixels[20]}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Input;
