import {ImageBackground, Platform, StyleSheet, View} from 'react-native';
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
    <ImageBackground
      source={require('../../../images/login.jpeg')}
      blurRadius={5}
      style={{
        flex: 1,
      }}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.appBlack,
          opacity: 0.5,
        }}
      />
      <View
        style={{flex: 1, justifyContent: 'center', margin: DevicePixels[40]}}>
        <Text
          style={{
            textAlign: 'center',
            marginVertical: DevicePixels[20],
            fontSize: DevicePixels[20],
            color: colors.appWhite,
          }}>
          What's your weight?
        </Text>
        <Text
          variant="bold"
          style={{
            color: colors.appWhite,
            textAlign: 'center',
            marginBottom: DevicePixels[20],
            fontSize: DevicePixels[30],
          }}>
          {`${weight} ${unit === 'metric' ? 'kg' : 'lbs'}`}
        </Text>

        <Picker
          style={{
            height: DevicePixels[200],
          }}
          selectedValue={weight}
          lineColor="#999999"
          textColor={colors.appWhite}
          itemStyle={{
            fontSize: DevicePixels[15],
            // color: Platform.OS === 'android' ? '#000' : undefined,
            color: colors.appWhite,
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
    </ImageBackground>
  );
};

export default SelectWeight;
