import {View} from 'react-native';
import React from 'react';
import Text from '../../commons/Text';
import colors from '../../../constants/colors';
import SelectableButton from '../../commons/SelectableButton';
import {Area} from '../../../types/QuickRoutines';

const areaDetails: {
  area: Area;
  text: string;
  secondaryText: string;
}[] = [
  {
    area: 'upper',
    text: 'Upper Body',
    secondaryText: 'Workouts for your chest, back, arms, shoulders and abs',
  },
  {
    area: 'lower',
    text: 'Lower Body',
    secondaryText: 'Train your glutes, quads, hamstrings and inner thigh',
  },
  {
    area: 'full',
    text: 'Full Body',
    secondaryText: 'Comprehensive workouts targeting all major muscle groups',
  },
];

const SelectArea: React.FC<{
  area: Area;
  setArea: (area: Area) => void;
}> = ({area, setArea}) => {
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
        What area do you want to focus on?
      </Text>
      {areaDetails.map(({text, secondaryText, area: a}) => {
        return (
          <SelectableButton
            key={a}
            text={text}
            secondaryText={secondaryText}
            selected={a === area}
            onPress={() => setArea(a)}
            style={{marginBottom: 15}}
          />
        );
      })}
    </View>
  );
};

export default SelectArea;
