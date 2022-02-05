import {TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {Gender} from '../../../types/Profile';
import DevicePixels from '../../../helpers/DevicePixels';
import Text from '../../commons/Text';
import colors from '../../../constants/colors';

const SelectSex: React.FC<{
  gender: Gender;
  setGender: (gender: Gender) => void;
}> = ({gender, setGender}) => {
  return (
    <View>
      <Text
        category="h4"
        style={{
          color: colors.appWhite,
          marginTop: DevicePixels[30],
          textAlign: 'center',
          marginBottom: DevicePixels[10],
          width: DevicePixels[250],
        }}>
        What's your gender?
      </Text>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: DevicePixels[175],
        }}>
        <TouchableOpacity
          onPress={() => setGender('female')}
          style={{
            marginBottom: DevicePixels[20],
            backgroundColor:
              gender === 'female' ? colors.appBlue : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.appBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: gender === 'female' ? colors.appWhite : colors.appBlue,
            }}>
            Female
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setGender('male')}
          style={{
            marginBottom: DevicePixels[20],
            backgroundColor:
              gender === 'male' ? colors.appBlue : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.appBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: gender === 'male' ? colors.appWhite : colors.appBlue,
            }}>
            Male
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectSex;
