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
import {SleepPattern} from '../../../types/Profile';
import Button from '../../commons/Button';

const SleepPatterns: React.FC<{
  sleepPattern: SleepPattern;
  setSleepPattern: (pattern: SleepPattern) => void;
}> = ({sleepPattern, setSleepPattern}) => {
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
        Sleep patterns?
      </Text>

      <Button
        onPress={() => setSleepPattern(SleepPattern.FIVE)}
        style={{marginBottom: DevicePixels[20]}}
        textStyle={{fontSize: DevicePixels[15]}}
        text=" minimal rest (less than 5 hours)"
        variant={sleepPattern === SleepPattern.FIVE ? 'primary' : 'secondary'}
      />
      <Button
        onPress={() => setSleepPattern(SleepPattern.FIVE_SIX)}
        style={{marginBottom: DevicePixels[20]}}
        textStyle={{fontSize: DevicePixels[15]}}
        text="I get just about what I need (5-6 hours)"
        variant={
          sleepPattern === SleepPattern.FIVE_SIX ? 'primary' : 'secondary'
        }
      />
      <Button
        onPress={() => setSleepPattern(SleepPattern.SEVEN_EIGHT)}
        style={{marginBottom: DevicePixels[20]}}
        textStyle={{fontSize: DevicePixels[15]}}
        text="I sleep well (7-8 hours)"
        variant={
          sleepPattern === SleepPattern.SEVEN_EIGHT ? 'primary' : 'secondary'
        }
      />
      <Button
        text="I’m a sleep warrior (8+ hours)"
        style={{marginBottom: DevicePixels[20]}}
        textStyle={{fontSize: DevicePixels[15]}}
        onPress={() => setSleepPattern(SleepPattern.EIGHT)}
        variant={sleepPattern === SleepPattern.EIGHT ? 'primary' : 'secondary'}
      />
    </View>
  );
};

export default SleepPatterns;
