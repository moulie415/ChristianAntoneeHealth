import {Platform, View} from 'react-native';
import React, {useEffect} from 'react';
import {Gender, Unit} from '../../types/Profile';
import Picker from '@gregfrench/react-native-wheel-picker';
import DevicePixels from '../../helpers/DevicePixels';
import Text from '../commons/Text';
import colors from '../../constants/colors';

const PickerItem = Picker.Item;

const weights = [...Array(501).keys()];

const SelectHeight: React.FC<{
  height: number;
  setHeight: (height: number) => void;
  unit: Unit;
  gender: Gender;
}> = ({height, setHeight, unit, gender}) => {
  useEffect(() => {
    if (!height) {
      if (gender === 'male') {
        setHeight(unit === 'metric' ? 175 : 69);
      }
      if (gender === 'female') {
        setHeight(unit === 'metric' ? 160 : 63);
      }
    }
  }, [height, gender, setHeight, unit]);

  return (
    <View>
      <Text
        category="h4"
        style={{
          textAlign: 'center',
          marginVertical: DevicePixels[20],
          width: DevicePixels[250],
          color: colors.appWhite,
        }}>
        What's your height?
      </Text>
      <Text
        category="h1"
        style={{
          color: colors.appBlue,
          textAlign: 'center',
          marginBottom: DevicePixels[20],
        }}>
        {`${height} ${unit === 'metric' ? 'cm' : 'inches'}`}
      </Text>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: DevicePixels[100],
        }}>
        <Picker
          style={{
            width: DevicePixels[250],
            height: DevicePixels[200],
            color: '#fff'
          }}
          textColor="#fff"
          selectedValue={height}
          lineColor="#999999"
          itemStyle={{
            fontSize: DevicePixels[15],
            color: '#fff'
          }}
          onValueChange={setHeight}>
          {weights.map(value => (
            <PickerItem
              label={`${value.toString()} ${
                unit === 'metric' ? 'cm' : 'inches'
              }`}
              value={value}
              key={value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default SelectHeight;
