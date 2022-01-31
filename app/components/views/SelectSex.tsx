import {View} from 'react-native';
import React, {useState} from 'react';
import {Gender} from '../../types/Profile';
import {IndexPath, Select, SelectItem} from '@ui-kitten/components';
import DevicePixels from '../../helpers/DevicePixels';
import Text from '../commons/Text';
import colors from '../../constants/colors';

const SelectSex: React.FC<{
  gender: Gender;
  setGender: (gender: Gender) => void;
}> = ({gender, setGender}) => {
  const [selectedGenderIndex, setSelectedGenderIndex] = useState(
    new IndexPath(gender && gender === 'female' ? 1 : 0),
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
        selectedIndex={selectedGenderIndex}
        onSelect={index => {
          setSelectedGenderIndex(index as IndexPath);
          if ('row' in index) {
            setGender(index.row === 0 ? 'male' : 'female');
          }
        }}
        value={gender || 'Select gender'}
        label="Gender">
        <SelectItem selected={gender === 'male'} title="male" />
        <SelectItem selected={gender === 'female'} title="female" />
      </Select>
    </View>
  );
};

export default SelectSex;
