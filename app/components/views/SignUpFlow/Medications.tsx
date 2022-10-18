import {ImageBackground, StyleSheet, View} from 'react-native';
import React from 'react';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import Input from '../../commons/Input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const Medications: React.FC<{
  medications: string;
  setMedications: (medications: string) => void;
}> = ({medications, setMedications}) => {
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
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
        Medications?
      </Text>
      <Input
        placeholder="List relevant medications... (optional)"
        style={{height: DevicePixels[100], textAlignVertical: 'top'}}
        multiline
        onChangeText={setMedications}
        value={medications}
        placeholderTextColor={colors.appWhite}
      />
    </KeyboardAwareScrollView>
  );
};

export default Medications;
