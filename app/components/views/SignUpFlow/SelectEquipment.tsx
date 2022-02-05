import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import Text from '../../commons/Text';
import {Equipment} from '../../../types/QuickRoutines';

const SelectEquipment: React.FC<{
  equipment: Equipment;
  setEquipment: (equipment: Equipment) => void;
}> = ({equipment, setEquipment}) => {
  return (
    <View>
      <Text
        category="h4"
        style={{
          textAlign: 'center',
          marginVertical: DevicePixels[20],
          width: DevicePixels[250],
          color: colors.appWhite,
        }}>
        What equipment do you have?
      </Text>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: DevicePixels[175],
        }}>
        <TouchableOpacity
          onPress={() => setEquipment('none')}
          style={{
            marginBottom: DevicePixels[20],
            backgroundColor:
              equipment === 'none' ? colors.appBlue : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.appBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: equipment === 'none' ? colors.appWhite : colors.appBlue,
            }}>
            I don’t have anything
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setEquipment('minimal')}
          style={{
            marginBottom: DevicePixels[20],
            backgroundColor:
              equipment === 'minimal' ? colors.appBlue : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.appBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: equipment === 'minimal' ? colors.appWhite : colors.appBlue,
            }}>
            I’ve got a few bits and pieces
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setEquipment('full')}
          style={{
            backgroundColor:
              equipment === 'full' ? colors.appBlue : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.appBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: equipment === 'full' ? colors.appWhite : colors.appBlue,
            }}>
            I’ve got access to a gym
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectEquipment;
