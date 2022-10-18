import React from 'react';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import Input from '../../commons/Input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const PhysicalInjuries: React.FC<{
  injuries: string;
  setInjuries: (injuries: string) => void;
}> = ({injuries, setInjuries}) => {
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
        Physical injuries?
      </Text>

      <Input
        placeholder="e.g. acute or chronic conditions"
        style={{height: DevicePixels[100], textAlignVertical: 'top'}}
        multiline
        onChangeText={setInjuries}
        value={injuries}
      />
    </KeyboardAwareScrollView>
  );
};

export default PhysicalInjuries;
