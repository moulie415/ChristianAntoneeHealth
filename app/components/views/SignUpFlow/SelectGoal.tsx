import React from 'react';
import { View } from 'react-native';
import colors from '../../../constants/colors';
import { getGoalReadableString } from '../../../helpers/goals';
import { Goal } from '../../../types/Shared';
import SelectableButton from '../../commons/SelectableButton';
import Text from '../../commons/Text';

export const goalDetails: {
  goal: Goal;
  text: string;
  secondaryText: string;
}[] = [
  {
    goal: Goal.STRENGTH,
    text: getGoalReadableString(Goal.STRENGTH),
    secondaryText: 'Develop your muscular and cardiovascular health',
  },
  {
    goal: Goal.WEIGHT_LOSS,
    text: getGoalReadableString(Goal.WEIGHT_LOSS),
    secondaryText: 'Decrease your body fat and risk of disease',
  },
  {
    goal: Goal.ACTIVE,
    text: getGoalReadableString(Goal.ACTIVE),
    secondaryText: 'Feel better as part of a healthier active lifestyle',
  },
  {
    goal: Goal.OTHER,
    text: getGoalReadableString(Goal.OTHER),
    secondaryText: 'Christian and I have discussed or will discuss my goal',
  },
];

const SelectGoal: React.FC<{
  goal: Goal;
  setGoal: (goal: Goal) => void;
  client: boolean;
}> = ({ goal, setGoal, client }) => {
  return (
    <View
      style={{
        flex: 1,
        marginHorizontal: 20,
        marginTop: 20,
      }}
    >
      <Text
        style={{
          marginBottom: 20,
          fontSize: 24,
          color: colors.appWhite,
          fontWeight: 'bold',
        }}
      >
        What's your goal?
      </Text>
      {goalDetails.map(({ text, secondaryText, goal: g }) => {
        if (g === Goal.OTHER && !client) {
          return null;
        }
        return (
          <SelectableButton
            key={g}
            text={text}
            secondaryText={secondaryText}
            selected={g === goal}
            onPress={() => setGoal(g)}
            style={{ marginBottom: 15 }}
          />
        );
      })}
    </View>
  );
};

export default SelectGoal;
