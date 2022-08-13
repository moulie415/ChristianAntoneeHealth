import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
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
          fontSize: DevicePixels[20],
          color: colors.appWhite,
        }}>
        What's your goal?
      </Text>
      <Button
        text="Improve my strength"
        style={{marginBottom: DevicePixels[20]}}
        onPress={() => setGoal(Goal.STRENGTH)}
        variant={goal === Goal.STRENGTH ? 'primary' : 'secondary'}
      />
      <Button
        text="Improve my fitness"
        style={{marginBottom: DevicePixels[20]}}
        onPress={() => setGoal(Goal.FITNESS)}
        variant={goal === Goal.FITNESS ? 'primary' : 'secondary'}
      />
      <Button
        text=" Weight loss"
        style={{marginBottom: DevicePixels[20]}}
        onPress={() => setGoal(Goal.WEIGHT_LOSS)}
        variant={goal === Goal.WEIGHT_LOSS ? 'primary' : 'secondary'}
      />
      <Button
        text="Injury prevention/rehabilitation"
        style={{marginBottom: DevicePixels[20]}}
        onPress={() => setGoal(Goal.INJURY_PREVENTION)}
        variant={goal === Goal.INJURY_PREVENTION ? 'primary' : 'secondary'}
      />
    </View>
  );
};

export default SelectGoal;
