import React, {Fragment} from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import colors from '../../../constants/colors';

import {equipmentItemReadableString} from '../../../helpers/exercises';
import {Equipment} from '../../../types/Shared';
import Divider from '../../commons/Divider';
import ListItem from '../../commons/ListItem';

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
              title={equipmentItemReadableString(item)}
              accessoryRight={
                selected ? (
                  <Icon
                    name="check-circle"
                    size={20}
                    solid
                    color={colors.appBlue}
                  />
                ) : (
                  <Icon name="circle" size={20} color={colors.appBlue} />
                )
              }
            />
            <Divider />
          </Fragment>
        );
      })}
    </View>
  );
};

export default EquipmentMenu;
