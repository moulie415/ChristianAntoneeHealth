import {ImageBackground, StyleSheet, View} from 'react-native';
import React from 'react';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import Input from '../../commons/Input';

const PhysicalInjuries: React.FC<{
  injuries: string;
  setInjuries: (injuries: string) => void;
}> = ({injuries, setInjuries}) => {
  return (
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
        Physical injuries?
      </Text>

      <Input
        placeholder="e.g. acute or chronic conditions"
        style={{height: DevicePixels[100], textAlignVertical: 'top'}}
        multiline
        onChangeText={setInjuries}
        value={injuries}
      />
    </View>
  );
};

export default PhysicalInjuries;
