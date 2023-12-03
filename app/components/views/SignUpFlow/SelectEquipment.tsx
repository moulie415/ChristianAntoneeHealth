import {View} from 'react-native';
import React from 'react';
import Text from '../../commons/Text';
import colors from '../../../constants/colors';
import SelectableButton from '../../commons/SelectableButton';
import {Equipment} from '../../../types/QuickRoutines';

const equipmentDetails: {
  equipment: Equipment;
  text: string;
  secondaryText: string;
}[] = [
  {
    equipment: 'none',
    text: 'I’ve got no equipment',
    secondaryText: 'No access to any equipment or a gym',
  },
  {
    equipment: 'minimal',
    text: 'I’ve got a few bits and pieces',
    secondaryText: 'Dumbbells, exercise ball, exercise mat',
  },
  {
    equipment: 'full',
    text: 'I’ve got access to a gym',
    secondaryText:
      'Dumbbells, weighted bars, bosu ball, exercise ball, exercise benches Kettlebell etc',
  },
];

const SelectEquipment: React.FC<{
  equipment: Equipment;
  setEquipment: (equipment: Equipment) => void;
}> = ({equipment, setEquipment}) => {
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
        What equipment do you have?
      </Text>
      {equipmentDetails.map(({text, secondaryText, equipment: e}) => {
        return (
          <SelectableButton
            key={e}
            text={text}
            secondaryText={secondaryText}
            selected={e === equipment}
            onPress={() => setEquipment(e)}
            style={{marginBottom: 15}}
          />
        );
      })}
    </View>
  );
};

export default SelectEquipment;
