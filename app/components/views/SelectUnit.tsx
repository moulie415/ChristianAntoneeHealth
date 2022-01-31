import {View} from 'react-native';
import React, {useState} from 'react';
import {IndexPath, Select, SelectItem} from '@ui-kitten/components';
import {Unit} from '../../types/Profile';
import DevicePixels from '../../helpers/DevicePixels';
import Text from '../commons/Text';
import colors from '../../constants/colors';

const SelectUnit: React.FC<{unit: Unit; setUnit: (unit: Unit) => void}> = ({
  unit,
  setUnit,
}) => {
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(
    new IndexPath(unit && unit === 'imperial' ? 1 : 0),
  );
  return (
    <View>
      <Text
        category="h4"
        style={{
          color: colors.appWhite,
          marginTop: DevicePixels[30],
          textAlign: 'center',
          marginBottom: DevicePixels[10],
        }}>
        Select unit
      </Text>
      <Select
        style={{width: DevicePixels[175]}}
        selectedIndex={selectedUnitIndex}
        onSelect={index => {
          setSelectedUnitIndex(index as IndexPath);
          if ('row' in index) {
            setUnit(index.row === 0 ? 'metric' : 'imperial');
          }
        }}
        value={unit || 'Select unit'}>
        <SelectItem selected={unit === 'metric'} title="metric (e.g. kg, cm)" />
        <SelectItem
          selected={unit === 'imperial'}
          title="imperial (e.g. lbs, inches)"
        />
      </Select>
    </View>
  );
};

export default SelectUnit;
