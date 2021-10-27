import {Divider, ListItem} from '@ui-kitten/components';
import React, {Fragment} from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../../constants/colors';
import DevicePixels from '../../../helpers/DevicePixels';
import {equipmentItemReadableString} from '../../../helpers/exercises';
import {Equipment} from '../../../types/Shared';

const EquipmentMenu: React.FC<{
  selectedEquipment: Equipment[];
  setSelectedEquipment: (equipment: Equipment[]) => void;
}> = ({selectedEquipment, setSelectedEquipment}) => {
  return (
    <View>
      {Object.values(Equipment).map(item => {
        const selected = selectedEquipment.includes(item);
        return (
          <Fragment key={item}>
            <ListItem
              onPress={() => {
                selected
                  ? setSelectedEquipment(
                      selectedEquipment.filter(i => i !== item),
                    )
                  : setSelectedEquipment([...selectedEquipment, item]);
              }}
              title={() => (
                <Text style={{color: selected ? colors.appBlue : '#000'}}>
                  {equipmentItemReadableString(item)}
                </Text>
              )}
              accessoryRight={() => {
                return selected ? (
                  <Icon
                    name="check-circle"
                    size={DevicePixels[20]}
                    solid
                    color={colors.appBlue}
                  />
                ) : (
                  <Icon
                    name="circle"
                    size={DevicePixels[20]}
                    color={colors.appBlue}
                  />
                );
              }}
            />
            <Divider />
          </Fragment>
        );
      })}
    </View>
  );
};

export default EquipmentMenu;
