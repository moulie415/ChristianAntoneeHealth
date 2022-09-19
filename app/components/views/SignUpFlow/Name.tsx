import {View} from 'react-native';
import React from 'react';
import DevicePixels from '../../../helpers/DevicePixels';
import Input from '../../commons/Input';
import Text from '../../commons/Text';
import colors from '../../../constants/colors';

const Name: React.FC<{
  name: string;
  setName: (name: string) => void;
  surname: string;
  setSurname: (name: string) => void;
}> = ({name, setName, surname, setSurname}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        margin: DevicePixels[40],
      }}>
      <Text
        style={{
          textAlign: 'center',
          marginBottom: DevicePixels[20],
          fontSize: DevicePixels[20],
          color: colors.appWhite,
        }}>
        What's your name?
      </Text>
      <Input
        containerStyle={{
          marginHorizontal: DevicePixels[20],
        }}
        placeholder="First Name"
        onChangeText={setName}
        value={name}
        placeholderTextColor="#fff"
        autoCorrect={false}
      />
      <Input
        containerStyle={{
          marginHorizontal: DevicePixels[20],
          marginTop: DevicePixels[20],
        }}
        placeholder="Last Name"
        onChangeText={setSurname}
        value={surname}
        placeholderTextColor="#fff"
        autoCorrect={false}
      />
    </View>
  );
};

export default Name;
