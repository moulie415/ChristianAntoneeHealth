import React from 'react';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import Input from '../../commons/Input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const GeneralLifestyle: React.FC<{
  lifestyle: string;
  setLifestyle: (lifestyle: string) => void;
}> = ({lifestyle, setLifestyle}) => {
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
        General lifestyle?
      </Text>

      <Input
        placeholder="e.g. active, sedentary, mixed"
        style={{
          height: DevicePixels[100],
          textAlignVertical: 'top',
          marginHorizontal: DevicePixels[10],
        }}
        multiline
        onChangeText={setLifestyle}
        value={lifestyle}
        placeholderTextColor={colors.appWhite}
      />
    </KeyboardAwareScrollView>
  );
};

export default GeneralLifestyle;
