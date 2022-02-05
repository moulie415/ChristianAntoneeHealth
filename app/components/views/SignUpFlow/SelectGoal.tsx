import {View} from 'react-native';
import React from 'react';
import {Goal} from '../../../types/Shared';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import {Radio, RadioGroup} from '@ui-kitten/components';

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
      <View>
        <RadioGroup selectedIndex={undefined}>
          <Radio>Weight training for Bone Density</Radio>
          <Radio>Strength Training for Weight Management</Radio>
          <Radio>Exercising for Core Strength</Radio>
        </RadioGroup>
      </View>
    </View>
  );
};

export default SelectGoal;
