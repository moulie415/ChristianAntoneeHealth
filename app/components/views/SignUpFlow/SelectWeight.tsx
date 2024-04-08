import React, {useEffect} from 'react';
import {View} from 'react-native';
import {Picker} from 'react-native-wheel-pick';
import {WEIGHTS} from '../../../constants';
import colors from '../../../constants/colors';
import {Gender, Unit} from '../../../types/Shared';
import Text from '../../commons/Text';

const SelectWeight: React.FC<{
  weight: number;
  setWeight: (weight: number) => void;
  unit: Unit;
  gender: Gender;
  index: number;
}> = ({weight, setWeight, unit, gender, index}) => {
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
    <View style={{flex: 1, justifyContent: 'center', margin: 40}}>
      <Text
        style={{
          textAlign: 'center',
          marginVertical: 20,
          fontSize: 20,
          color: colors.appWhite,
        }}>
        What's your weight?
      </Text>
      <Text
        style={{
          color: colors.appWhite,
          textAlign: 'center',
          marginBottom: 20,
          fontSize: 30,
          fontWeight: 'bold',
        }}>
        {`${weight} ${unit === 'metric' ? 'kg' : 'lbs'}`}
      </Text>

      {(index === 3 || !!weight) && (
        /* @ts-ignore */
        <Picker
          style={{height: 200, backgroundColor: 'transparent'}}
          textColor={colors.appWhite}
          itemStyle={{color: colors.appWhite}}
          selectedValue={String(weight)}
          pickerData={WEIGHTS.map(value => {
            return {
              label: `${value.toString()} ${unit === 'metric' ? 'kg' : 'lbs'}`,
              value: String(value),
            };
          })}
          onValueChange={(val: any) => setWeight(Number(val))}
        />
      )}
    </View>
  );
};

export default SelectWeight;
