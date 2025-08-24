import {FontAwesome6} from '@react-native-vector-icons/fontawesome6';
import React, {Fragment} from 'react';
import {View} from 'react-native';
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
                  <FontAwesome6
                    name="circle-check"
                    size={20}
                    iconStyle="solid"
                    color={colors.appBlue}
                  />
                ) : (
                  <FontAwesome6
                    name="circle"
                    size={20}
                    color={colors.appBlue}
                  />
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
