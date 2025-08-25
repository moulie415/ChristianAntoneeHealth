import React from 'react';
import { View } from 'react-native';
import { EQUIPMENT_LIST } from '../../../constants';
import colors from '../../../constants/colors';
import { equipmentItemReadableString } from '../../../helpers/exercises';
import { Equipment } from '../../../types/QuickRoutines';
import { Equipment as EquipmentItem } from '../../../types/Shared';
import MultiSelect from '../../commons/MultiSelect';
import SelectableButton from '../../commons/SelectableButton';
import Text from '../../commons/Text';

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
  equipmentList: EquipmentItem[];
  setEquipmentList: (list: EquipmentItem[]) => void;
}> = ({ equipment, setEquipment, equipmentList, setEquipmentList }) => {
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
        What equipment do you have?
      </Text>
      {equipmentDetails.map(({ text, secondaryText, equipment: e }) => {
        return (
          <SelectableButton
            key={e}
            text={text}
            secondaryText={secondaryText}
            selected={e === equipment}
            onPress={() => setEquipment(e)}
            style={{ marginBottom: 15 }}
          />
        );
      })}
      {!!equipment && equipment !== 'none' && (
        <MultiSelect
          items={EQUIPMENT_LIST.map(item => {
            return { id: item, name: equipmentItemReadableString(item) };
          })}
          selectedItems={equipmentList}
          onSelectedItemsChange={setEquipmentList}
          selectText="Equipment list"
        />
      )}
    </View>
  );
};

export default SelectEquipment;
