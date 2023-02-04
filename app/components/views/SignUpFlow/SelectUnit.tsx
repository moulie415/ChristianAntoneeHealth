import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Unit} from '../../../types/Profile';

import Text from '../../commons/Text';
import colors from '../../../constants/colors';

const SelectUnit: React.FC<{unit: Unit; setUnit: (unit: Unit) => void}> = ({
  unit,
  setUnit,
}) => {
  return (
    <View>
      <Text
        style={{
          color: colors.appWhite,
          marginTop: 30,
          textAlign: 'center',
          marginBottom: 10,
        }}>
        Preferred unit?
      </Text>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: 175,
        }}>
        <TouchableOpacity
          onPress={() => setUnit('metric')}
          style={{
            marginBottom: 20,
            backgroundColor:
              unit === 'metric' ? colors.darkBlue : colors.appWhite,
            padding: 10,
            borderColor: colors.darkBlue,
            borderWidth: 1,
            borderRadius: 5,
            width: 200,
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
            marginBottom: 20,
            backgroundColor:
              unit === 'imperial' ? colors.darkBlue : colors.appWhite,
            padding: 10,
            borderColor: colors.darkBlue,
            borderWidth: 1,
            borderRadius: 5,
            width: 200,
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
