import {View} from 'react-native';
import React, {useState} from 'react';
import {Gender} from '../../../types/Profile';

import Text from '../../commons/Text';
import colors from '../../../constants/colors';
import Button from '../../commons/Button';

const SelectSex: React.FC<{
  gender: Gender;
  setGender: (gender: Gender) => void;
}> = ({gender, setGender}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        margin: 50,
      }}>
      <Text
        style={{
          color: colors.appWhite,

          textAlign: 'center',
          marginBottom: 20,
          fontSize: 20,
        }}>
        What's your sex?
      </Text>

      <Button
        text="Female"
        style={{
          marginBottom: 20,
          marginHorizontal: 20,
        }}
        onPress={() => setGender('female')}
        variant={gender === 'female' ? 'primary' : 'secondary'}
      />

      <Button
        text="Male"
        style={{marginBottom: 20, marginHorizontal: 20}}
        onPress={() => setGender('male')}
        variant={gender === 'male' ? 'primary' : 'secondary'}
      />
      <Button
        text="Prefer not to say"
        style={{marginHorizontal: 20}}
        onPress={() => setGender(null)}
        variant={gender === null ? 'primary' : 'secondary'}
      />
    </View>
  );
};

export default SelectSex;
