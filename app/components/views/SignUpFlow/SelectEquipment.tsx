import {View} from 'react-native';
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
    <View>
      <Text
        category="h4"
        style={{
          textAlign: 'center',
          marginVertical: DevicePixels[20],
          width: DevicePixels[250],
          color: colors.appBlue,
        }}>
        What equipment do you have?
      </Text>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: DevicePixels[175],
        }}>
        <Input
          placeholder="e.g. dumbbells, barbells, squat rack..."
          textStyle={{height: DevicePixels[100]}}
          multiline
          onChangeText={setEquipment}
          value={equipment}
        />
      </View>
    </View>
  );
};

export default SelectEquipment;
