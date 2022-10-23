import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import {StressLevel} from '../../../types/Profile';
import Button from '../../commons/Button';

const StressLevels: React.FC<{
  stressLevel: StressLevel;
  setStressLevel: (level: StressLevel) => void;
}> = ({stressLevel, setStressLevel}) => {
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
          color: colors.appWhite,
          fontSize: DevicePixels[20],
        }}>
        Stress level?
      </Text>

      <Button
        onPress={() => setStressLevel('low')}
        text="Low"
        variant={stressLevel === 'low' ? 'primary' : 'secondary'}
        style={{
          marginBottom: DevicePixels[20],

          marginHorizontal: DevicePixels[20],
        }}
      />
      <Button
        onPress={() => setStressLevel('medium')}
        text="Medium"
        variant={stressLevel === 'medium' ? 'primary' : 'secondary'}
        style={{
          marginBottom: DevicePixels[20],
          marginHorizontal: DevicePixels[20],
        }}
      />
      <Button
        onPress={() => setStressLevel('high')}
        text="High"
        variant={stressLevel === 'high' ? 'primary' : 'secondary'}
        style={{
          marginBottom: DevicePixels[20],
          marginHorizontal: DevicePixels[20],
        }}
      />
    </View>
  );
};

export default StressLevels;
