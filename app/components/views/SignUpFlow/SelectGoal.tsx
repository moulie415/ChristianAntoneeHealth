import {View} from 'react-native';
import React from 'react';
import {Goal} from '../../../types/Shared';
import Text from '../../commons/Text';

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
        margin: 50,
      }}>
      <Text
        style={{
          textAlign: 'center',
          marginVertical: 20,
          fontSize: 20,
          color: colors.appWhite,
        }}>
        What's your goal?
      </Text>
      <Button
        text="Improve strength and fitness"
        style={{
          marginBottom: 20,
          marginHorizontal: 20,
        }}
        textStyle={{fontSize: 13}}
        onPress={() => setGoal(Goal.STRENGTH)}
        variant={goal === Goal.STRENGTH ? 'primary' : 'secondary'}
      />
      <Button
        text=" Weight loss"
        style={{
          marginBottom: 20,
          marginHorizontal: 20,
        }}
        textStyle={{fontSize: 15}}
        onPress={() => setGoal(Goal.WEIGHT_LOSS)}
        variant={goal === Goal.WEIGHT_LOSS ? 'primary' : 'secondary'}
      />
      <Button
        text="Become more active"
        textStyle={{fontSize: 15}}
        style={{
          marginBottom: 20,
          marginHorizontal: 20,
        }}
        onPress={() => setGoal(Goal.ACTIVE)}
        variant={goal === Goal.ACTIVE ? 'primary' : 'secondary'}
      />
    </View>
  );
};

export default SelectGoal;
