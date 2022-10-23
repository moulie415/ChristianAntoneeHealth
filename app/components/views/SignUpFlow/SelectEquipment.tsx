import {ImageBackground, StyleSheet, View} from 'react-native';
import React from 'react';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import Text from '../../commons/Text';
import Input from '../../commons/Input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const SelectEquipment: React.FC<{
  equipment: string;
  setEquipment: (equipment: string) => void;
}> = ({equipment, setEquipment}) => {
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
        margin: DevicePixels[50],
      }}>
      <Text
        style={{
          textAlign: 'center',
          marginVertical: DevicePixels[20],

          fontSize: DevicePixels[20],
          color: colors.appWhite,
        }}>
        What equipment do you have?
      </Text>

      <Input
        placeholder="e.g. dumbbells, barbells, squat rack..."
        style={{
          height: DevicePixels[100],
          textAlignVertical: 'top',
          marginHorizontal: DevicePixels[10],
        }}
        multiline
        onChangeText={setEquipment}
        value={equipment}
        placeholderTextColor={colors.appWhite}
      />
    </KeyboardAwareScrollView>
  );
};

export default SelectEquipment;
