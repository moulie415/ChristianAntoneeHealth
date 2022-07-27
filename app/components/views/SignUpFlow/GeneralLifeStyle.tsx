import {ImageBackground, StyleSheet, View} from 'react-native';
import React from 'react';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import Input from '../../commons/Input';

const GeneralLifestyle: React.FC<{
  lifestyle: string;
  setLifestyle: (lifestyle: string) => void;
}> = ({lifestyle, setLifestyle}) => {
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
            textAlign: 'center',
            marginVertical: DevicePixels[20],
            fontSize: DevicePixels[20],
            color: colors.appWhite,
          }}>
          General lifestyle?
        </Text>

        <Input
          placeholder="e.g. active, sedentary, mixed"
          style={{height: DevicePixels[100], textAlignVertical: 'top'}}
          multiline
          onChangeText={setLifestyle}
          value={lifestyle}
          placeholderTextColor={colors.appWhite}
        />
      </View>
    </ImageBackground>
  );
};

export default GeneralLifestyle;
