import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import {SleepPattern} from '../../../types/Profile';

const SleepPatterns: React.FC<{
  sleepPattern: SleepPattern;
  setSleepPattern: (pattern: SleepPattern) => void;
}> = ({sleepPattern, setSleepPattern}) => {
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
        Sleep patterns?
      </Text>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: DevicePixels[175],
        }}>
        <TouchableOpacity
          onPress={() => setSleepPattern(SleepPattern.FIVE)}
          style={{
            marginBottom: DevicePixels[20],
            backgroundColor:
              sleepPattern === SleepPattern.FIVE
                ? colors.appBlue
                : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.appBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color:
                sleepPattern === SleepPattern.FIVE
                  ? colors.appWhite
                  : colors.appBlue,
            }}>
            minimal rest (less than 5 hours)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSleepPattern(SleepPattern.FIVE_SIX)}
          style={{
            marginBottom: DevicePixels[20],
            backgroundColor:
              sleepPattern === SleepPattern.FIVE_SIX
                ? colors.appBlue
                : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.appBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color:
                sleepPattern === SleepPattern.FIVE_SIX
                  ? colors.appWhite
                  : colors.appBlue,
            }}>
            I get just about what I need (5-6 hours)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSleepPattern(SleepPattern.SEVEN_EIGHT)}
          style={{
            marginBottom: DevicePixels[20],
            backgroundColor:
              sleepPattern === SleepPattern.SEVEN_EIGHT
                ? colors.appBlue
                : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.appBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color:
                sleepPattern === SleepPattern.SEVEN_EIGHT
                  ? colors.appWhite
                  : colors.appBlue,
            }}>
            I sleep well (7-8 hours)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSleepPattern(SleepPattern.EIGHT)}
          style={{
            marginBottom: DevicePixels[20],
            backgroundColor:
              sleepPattern === SleepPattern.EIGHT
                ? colors.appBlue
                : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.appBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color:
                sleepPattern === SleepPattern.EIGHT
                  ? colors.appWhite
                  : colors.appBlue,
            }}>
            I’m a sleep warrior (8+ hours)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SleepPatterns;
