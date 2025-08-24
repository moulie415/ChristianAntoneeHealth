import React, {Fragment} from 'react';
import colors from '../../constants/colors';
import {equipmentItemReadableString} from '../../helpers/exercises';
import {useAppSelector} from '../../hooks/redux';
import {Equipment} from '../../types/Shared';
import Text from './Text';

const EquipmentList: React.FC<{equipment: Equipment[]}> = ({equipment}) => {
  const {profile} = useAppSelector(state => state.profile);
  const equipmentList = profile.equipmentList || [];

  if (!(equipment && equipment.length)) {
    return null;
  }

  return (
    <Text>
      (
      {equipment.map((item, index) => {
        return (
          <Fragment key={item}>
            <Text
              style={{
                color: equipmentList.includes(item)
                  ? colors.appWhite
                  : colors.appRed,
                fontWeight: 'bold',
              }}>
              {equipmentItemReadableString(item)}
            </Text>
            {index + 1 === equipment.length ? '' : ', '}
          </Fragment>
        );
      })}
      )
    </Text>
  );
};

export default EquipmentList;
