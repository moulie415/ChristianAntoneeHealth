import {View} from 'react-native';
import React, {useEffect} from 'react';
import {Gender, Unit} from '../../../types/Profile';
import {Picker} from 'react-native-wheel-pick';
import DevicePixels from '../../../helpers/DevicePixels';
import Text from '../../commons/Text';
import colors from '../../../constants/colors';

const heights = [...Array(501).keys()];

const SelectHeight: React.FC<{
  height: number;
  setHeight: (height: number) => void;
  unit: Unit;
  gender: Gender;
  index: number;
}> = ({height, setHeight, unit, gender, index}) => {
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
    <View style={{flex: 1, justifyContent: 'center', margin: DevicePixels[40]}}>
      <Text
        style={{
          textAlign: 'center',
          marginVertical: DevicePixels[20],
          fontSize: DevicePixels[20],
          color: colors.appWhite,
        }}>
        What's your height?
      </Text>
      <Text
        style={{
          color: colors.appWhite,
          textAlign: 'center',
          marginBottom: DevicePixels[20],
          fontSize: DevicePixels[30],
          fontWeight: 'bold',
        }}>
        {`${height} ${unit === 'metric' ? 'cm' : 'inches'}`}
      </Text>

      {(index === 4 || height) && (
        /* @ts-ignore */
        <Picker
          style={{height: DevicePixels[200], backgroundColor: 'transparent'}}
          textColor={colors.appWhite}
          itemStyle={{color: colors.appWhite}}
          selectedValue={String(height)}
          pickerData={heights.map(value => {
            return {
              label: `${value.toString()} ${
                unit === 'metric' ? 'cm' : 'inches'
              }`,
              value: String(value),
            };
          })}
          onValueChange={val => setHeight(Number(val))}
        />
      )}
    </View>
  );
};

export default SelectHeight;
