import React from 'react';

import Input from '../../commons/Input';
import Text from '../../commons/Text';
import colors from '../../../constants/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const Name: React.FC<{
  name: string;
  setName: (name: string) => void;
  surname: string;
  setSurname: (name: string) => void;
}> = ({name, setName, surname, setSurname}) => {
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
        margin: 40,
      }}
      style={{}}>
      <Text
        style={{
          textAlign: 'center',
          marginBottom: 20,
          fontSize: 20,
          color: colors.appWhite,
        }}>
        What's your name?
      </Text>
      <Input
        containerStyle={{
          marginHorizontal: 20,
        }}
        placeholder="First Name"
        onChangeText={setName}
        value={name}
        placeholderTextColor="#fff"
        autoCorrect={false}
      />
      <Input
        containerStyle={{
          marginHorizontal: 20,
          marginTop: 20,
        }}
        placeholder="Last Name"
        onChangeText={setSurname}
        value={surname}
        placeholderTextColor="#fff"
        autoCorrect={false}
      />
    </KeyboardAwareScrollView>
  );
};

export default Name;
