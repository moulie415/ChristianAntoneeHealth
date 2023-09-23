import {ImageBackground, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';

import colors from '../../../constants/colors';
import Text from '../../commons/Text';
import Input from '../../commons/Input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const SelectEquipment: React.FC<{
  equipment: string;
  setEquipment: (equipment: string) => void;
}> = ({setEquipment, equipment}) => {
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
        What equipment do you have?
      </Text>

      <Input
        placeholder="e.g. dumbbells, barbells, squat rack..."
        style={{
          height: 100,
          textAlignVertical: 'top',
          marginHorizontal: 10,
        }}
        multiline
        onChangeText={setEquipment}
        defaultValue={equipment}
        placeholderTextColor={colors.appWhite}
      />
    </KeyboardAwareScrollView>
  );
};

export default SelectEquipment;
