import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Goal} from '../../../types/Shared';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import Button from '../../commons/Button';

const SelectGoal: React.FC<{goal: Goal; setGoal: (goal: Goal) => void}> = ({
  goal,
  setGoal,
}) => {
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
        What's your goal?
      </Text>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: DevicePixels[175],
        }}>
        <TouchableOpacity
          onPress={() => setGoal(Goal.STRENGTH)}
          style={{
            marginBottom: DevicePixels[20],
            backgroundColor:
              goal === Goal.STRENGTH ? colors.darkBlue : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.darkBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: goal === Goal.STRENGTH ? colors.appWhite : colors.darkBlue,
            }}>
            Improve my strength
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setGoal(Goal.FITNESS)}
          style={{
            backgroundColor:
              goal === Goal.FITNESS ? colors.darkBlue : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.darkBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: goal === Goal.FITNESS ? colors.appWhite : colors.darkBlue,
            }}>
            Improve my fitness
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setGoal(Goal.WEIGHT_LOSS)}
          style={{
            backgroundColor:
              goal === Goal.WEIGHT_LOSS ? colors.darkBlue : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.darkBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color:
                goal === Goal.WEIGHT_LOSS ? colors.appWhite : colors.darkBlue,
            }}>
            Weight loss
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setGoal(Goal.INJURY_PREVENTION)}
          style={{
            backgroundColor:
              goal === Goal.INJURY_PREVENTION
                ? colors.darkBlue
                : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.darkBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color:
                goal === Goal.INJURY_PREVENTION
                  ? colors.appWhite
                  : colors.darkBlue,
            }}>
            Injury prevention/rehabilitation
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectGoal;
