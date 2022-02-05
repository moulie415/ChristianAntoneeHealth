import {Platform, View} from 'react-native';
import React, {useEffect} from 'react';
import {Gender, Unit} from '../../../types/Profile';
import Picker from '@gregfrench/react-native-wheel-picker';
import DevicePixels from '../../../helpers/DevicePixels';
import Text from '../../commons/Text';
import colors from '../../../constants/colors';

const PickerItem = Picker.Item;

const weights = [...Array(501).keys()];

const SelectWeight: React.FC<{
  weight: number;
  setWeight: (weight: number) => void;
  unit: Unit;
  gender: Gender;
}> = ({weight, setWeight, unit, gender}) => {
  useEffect(() => {
    if (!weight) {
      if (gender === 'male') {
        setWeight(unit === 'metric' ? 84 : 185);
      }
      if (gender === 'female') {
        setWeight(unit === 'metric' ? 70 : 154);
      }
    }
  }, [weight, gender, setWeight, unit]);

  return (
    <View>
      <Text
        category="h4"
        style={{
          textAlign: 'center',
          marginVertical: DevicePixels[20],
          width: DevicePixels[250],
        }}>
        What's your weight?
      </Text>
      <Text
        category="h1"
        style={{
          color: colors.appBlue,
          textAlign: 'center',
          marginBottom: DevicePixels[20],
        }}>
        {`${weight} ${unit === 'metric' ? 'kg' : 'lbs'}`}
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
          }}
          selectedValue={weight}
          lineColor="#999999"
          itemStyle={{
            fontSize: DevicePixels[15],
            color: Platform.OS === 'android' ? '#000' : undefined,
          }}
          onValueChange={setWeight}>
          {weights.map(value => (
            <PickerItem
              label={`${value.toString()} ${unit === 'metric' ? 'kg' : 'lbs'}`}
              value={value}
              key={value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default SelectWeight;
