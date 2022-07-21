import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Gender} from '../../../types/Profile';
import DevicePixels from '../../../helpers/DevicePixels';
import Text from '../../commons/Text';
import colors from '../../../constants/colors';
import Button from '../../commons/Button';

const SelectSex: React.FC<{
  gender: Gender;
  setGender: (gender: Gender) => void;
}> = ({gender, setGender}) => {
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
        style={{
          flex: 1,
          justifyContent: 'center',
          margin: DevicePixels[50],
        }}>
        <Text
          style={{
            color: colors.appWhite,
            marginTop: DevicePixels[30],
            textAlign: 'center',
            marginBottom: DevicePixels[20],
            fontSize: DevicePixels[20],
          }}>
          What's your gender?
        </Text>

        <Button
          text="Female"
          style={{marginBottom: DevicePixels[20]}}
          onPress={() => setGender('female')}
          variant={gender === 'female' ? 'primary' : 'secondary'}
        />

        <Button
          text="Male"
          onPress={() => setGender('male')}
          variant={gender === 'male' ? 'primary' : 'secondary'}
        />
      </View>
    </ImageBackground>
  );
};

export default SelectSex;
