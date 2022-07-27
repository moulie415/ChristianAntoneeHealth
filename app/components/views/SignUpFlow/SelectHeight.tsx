import {ImageBackground, Platform, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {Gender, Unit} from '../../../types/Profile';
import Picker from '@gregfrench/react-native-wheel-picker';
import DevicePixels from '../../../helpers/DevicePixels';
import Text from '../../commons/Text';
import colors from '../../../constants/colors';

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

        <Picker
          style={{
            height: DevicePixels[200],
          }}
          selectedValue={height}
          lineColor="#999999"
          textColor={colors.appWhite}
          itemStyle={{
            fontSize: DevicePixels[15],
            // color: Platform.OS === 'android' ? '#000' : undefined,
            color: colors.appWhite,
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
    </ImageBackground>
  );
};

export default SelectHeight;
