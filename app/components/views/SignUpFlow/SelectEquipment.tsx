import {ImageBackground, StyleSheet, View} from 'react-native';
import React from 'react';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import Text from '../../commons/Text';
import Input from '../../commons/Input';

const SelectEquipment: React.FC<{
  equipment: string;
  setEquipment: (equipment: string) => void;
}> = ({equipment, setEquipment}) => {
  return (
    <View
      style={{
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
        style={{height: DevicePixels[100], textAlignVertical: 'top'}}
        multiline
        onChangeText={setEquipment}
        value={equipment}
        placeholderTextColor={colors.appWhite}
      />
    </View>
  );
};

export default SelectEquipment;
