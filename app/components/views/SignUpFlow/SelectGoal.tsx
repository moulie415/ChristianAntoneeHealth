import {TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
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
          onPress={() => setGoal(Goal.BONE_DENSITY)}
          style={{
            marginBottom: DevicePixels[20],
            backgroundColor:
              goal === Goal.BONE_DENSITY ? colors.darkBlue : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.darkBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color:
                goal === Goal.BONE_DENSITY ? colors.appWhite : colors.darkBlue,
            }}>
            Weight training for Bone Density
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setGoal(Goal.WEIGHT)}
          style={{
            marginBottom: DevicePixels[20],
            backgroundColor:
              goal === Goal.WEIGHT ? colors.darkBlue : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.darkBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: goal === Goal.WEIGHT ? colors.appWhite : colors.darkBlue,
            }}>
            Strength Training for Weight Management
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setGoal(Goal.CORE)}
          style={{
            backgroundColor:
              goal === Goal.CORE ? colors.darkBlue : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.darkBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: goal === Goal.CORE ? colors.appWhite : colors.darkBlue,
            }}>
            Exercising for Core Strength
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectGoal;
