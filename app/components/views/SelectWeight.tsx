import {Platform, View} from 'react-native';
import React from 'react';
import {Unit} from '../../types/Profile';
import Picker from '@gregfrench/react-native-wheel-picker';
import DevicePixels from '../../helpers/DevicePixels';

const PickerItem = Picker.Item;

const weights = [...Array(501).keys()];

const SelectWeight: React.FC<{
  weight: number;
  setWeight: (weight: number) => void;
  unit: Unit;
}> = ({weight, setWeight, unit}) => {
  return (
    <View style={{flex: 1, justifyContent: 'flex-end'}}>
      <Picker
        style={{
          width: DevicePixels[250],
          height: DevicePixels[200],
        }}
        selectedValue={weight}
        lineColor="#999999"
        itemStyle={{
          fontSize: DevicePixels[15],
          color: Platform.OS === 'android' ? '#000' : undefined,
        }}
        onValueChange={setWeight}>
        <PickerItem label={'Test'} value={5} key="5" />
        <PickerItem label={'Test'} value={5} key="6" />
        <PickerItem label={'Test'} value={5} key="7" />
      </Picker>
    </View>
  );
};

export default SelectWeight;
