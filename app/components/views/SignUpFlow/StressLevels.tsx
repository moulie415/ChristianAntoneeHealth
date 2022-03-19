import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import {StressLevel} from '../../../types/Profile';

const StressLevels: React.FC<{
  stressLevel: StressLevel;
  setStressLevel: (level: StressLevel) => void;
}> = ({stressLevel, setStressLevel}) => {
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
        Stress level?
      </Text>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: DevicePixels[175],
        }}>
        <TouchableOpacity
          onPress={() => setStressLevel('low')}
          style={{
            marginBottom: DevicePixels[20],
            backgroundColor:
              stressLevel === 'low' ? colors.darkBlue : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.darkBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: stressLevel === 'low' ? colors.appWhite : colors.darkBlue,
            }}>
            Low
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setStressLevel('medium')}
          style={{
            marginBottom: DevicePixels[20],
            backgroundColor:
              stressLevel === 'medium' ? colors.darkBlue : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.darkBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color:
                stressLevel === 'medium' ? colors.appWhite : colors.darkBlue,
            }}>
            Medium
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setStressLevel('high')}
          style={{
            marginBottom: DevicePixels[20],
            backgroundColor:
              stressLevel === 'high' ? colors.darkBlue : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.darkBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: stressLevel === 'high' ? colors.appWhite : colors.darkBlue,
            }}>
            High
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StressLevels;
