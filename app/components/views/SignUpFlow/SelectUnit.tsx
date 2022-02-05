import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Unit} from '../../../types/Profile';
import DevicePixels from '../../../helpers/DevicePixels';
import Text from '../../commons/Text';
import colors from '../../../constants/colors';

const SelectUnit: React.FC<{unit: Unit; setUnit: (unit: Unit) => void}> = ({
  unit,
  setUnit,
}) => {
  return (
    <View>
      <Text
        category="h4"
        style={{
          color: colors.appWhite,
          marginTop: DevicePixels[30],
          textAlign: 'center',
          marginBottom: DevicePixels[10],
        }}>
        Preferred unit?
      </Text>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: DevicePixels[175],
        }}>
        <TouchableOpacity
          onPress={() => setUnit('metric')}
          style={{
            marginBottom: DevicePixels[20],
            backgroundColor:
              unit === 'metric' ? colors.darkBlue : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.darkBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
            width: DevicePixels[200],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: unit === 'metric' ? colors.appWhite : colors.darkBlue,
            }}>
            metric (e.g. kg, cm)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setUnit('imperial')}
          style={{
            marginBottom: DevicePixels[20],
            backgroundColor:
              unit === 'imperial' ? colors.darkBlue : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.darkBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
            width: DevicePixels[200],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: unit === 'imperial' ? colors.appWhite : colors.darkBlue,
            }}>
            imperial (e.g. lbs, inches)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectUnit;
