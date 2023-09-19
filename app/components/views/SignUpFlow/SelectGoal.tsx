import {View} from 'react-native';
import React from 'react';
import {Goal} from '../../../types/Shared';
import Text from '../../commons/Text';

import colors from '../../../constants/colors';
import Button from '../../commons/Button';
import SelectableButton from '../../commons/SelectableButton';

const goalDetails: {goal: Goal; text: string; secondaryText: string}[] = [
  {
    goal: Goal.STRENGTH,
    text: 'Improve strength & fitness',
    secondaryText: 'Develop your muscular and cardiovascular health',
  },
  {
    goal: Goal.WEIGHT_LOSS,
    text: 'Weight loss',
    secondaryText: 'Decrease your body fat and risk of disease',
  },
  {
    goal: Goal.ACTIVE,
    text: 'Become more active',
    secondaryText: 'Feel better as part of a healthier active lifestyle',
  },
];

const SelectGoal: React.FC<{goal: Goal; setGoal: (goal: Goal) => void}> = ({
  goal,
  setGoal,
}) => {
  return (
    <View
      style={{
        flex: 1,
        marginHorizontal: 20,
        marginTop: 20,
      }}>
      <Text
        style={{
          marginBottom: 20,
          fontSize: 24,
          color: colors.appWhite,
          fontWeight: 'bold',
        }}>
        What's your goal?
      </Text>
      {goalDetails.map(({text, secondaryText, goal: g}) => {
        return (
          <SelectableButton
            key={g}
            text={text}
            secondaryText={secondaryText}
            selected={g === goal}
            onPress={() => setGoal(g)}
            style={{marginBottom: 15}}
          />
        );
      })}
      {/* <Button
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
      /> */}
    </View>
  );
};

export default SelectGoal;
