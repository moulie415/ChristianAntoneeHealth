import React from 'react';
import Text from '../../commons/Text';

import colors from '../../../constants/colors';
import Input from '../../commons/Input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const GeneralLifestyle: React.FC<{
  lifestyle: string;
  setLifestyle: (lifestyle: string) => void;
}> = ({lifestyle, setLifestyle}) => {
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
        margin: 50,
      }}>
      <Text
        style={{
          textAlign: 'center',
          marginVertical: 20,
          fontSize: 20,
          color: colors.appWhite,
        }}>
        General lifestyle?
      </Text>

      <Input
        placeholder="e.g. active, sedentary, mixed"
        style={{
          height: 100,
          textAlignVertical: 'top',
          marginHorizontal: 10,
        }}
        multiline
        onChangeText={setLifestyle}
        defaultValue={lifestyle}
        placeholderTextColor={colors.appWhite}
      />
    </KeyboardAwareScrollView>
  );
};

export default GeneralLifestyle;
