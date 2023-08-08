import {View} from 'react-native';
import React, {useEffect} from 'react';
import {Gender, Unit} from '../../../types/Profile';
import {Picker} from 'react-native-wheel-pick';

import Text from '../../commons/Text';
import colors from '../../../constants/colors';
import {HEIGHTS} from '../../../constants';

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
    <View style={{flex: 1, justifyContent: 'center', margin: 40}}>
      <Text
        style={{
          textAlign: 'center',
          marginVertical: 20,
          fontSize: 20,
          color: colors.appWhite,
        }}>
        What's your height?
      </Text>
      <Text
        style={{
          color: colors.appWhite,
          textAlign: 'center',
          marginBottom: 20,
          fontSize: 30,
          fontWeight: 'bold',
        }}>
        {`${height} ${unit === 'metric' ? 'cm' : 'inches'}`}
      </Text>

      {(index === 3 || !!height) && (
        /* @ts-ignore */
        <Picker
          style={{height: 200, backgroundColor: 'transparent'}}
          textColor={colors.appWhite}
          itemStyle={{color: colors.appWhite}}
          selectedValue={String(height)}
          pickerData={HEIGHTS.map(value => {
            return {
              label: `${value.toString()} ${
                unit === 'metric' ? 'cm' : 'inches'
              }`,
              value: String(value),
            };
          })}
          onValueChange={(val: any) => setHeight(Number(val))}
        />
      )}
    </View>
  );
};

export default SelectHeight;
