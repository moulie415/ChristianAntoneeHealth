import {View} from 'react-native';
import React, { useState } from 'react';
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
      <Button>Weight training for Bone Density</Button>
      <Button>Strength Training for Weight Management </Button>
      <Button>Exercising for Core Strength</Button>
    </View>
  );
};

export default SelectGoal;
