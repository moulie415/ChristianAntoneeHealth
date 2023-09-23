import {ImageBackground, StyleSheet, View} from 'react-native';
import React from 'react';
import Text from '../../commons/Text';

import colors from '../../../constants/colors';
import Input from '../../commons/Input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const Medications: React.FC<{
  medications: string;
  setMedications: (medications: string) => void;
}> = ({medications, setMedications}) => {
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
        margin: 50,
      }}>
      <Text
        style={{
          textAlign: 'center',
          marginVertical: 20,
          fontSize: 20,
          color: colors.appWhite,
        }}>
        Medications?
      </Text>
      <Input
        placeholder="List relevant medications... (optional)"
        style={{
          height: 100,
          textAlignVertical: 'top',
          marginHorizontal: 10,
        }}
        multiline
        onChangeText={setMedications}
        defaultValue={medications}
        placeholderTextColor={colors.appWhite}
      />
    </KeyboardAwareScrollView>
  );
};

export default Medications;
