import React from 'react';
import Text from '../../commons/Text';

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
        margin: 50,
      }}>
      <Text
        style={{
          textAlign: 'center',
          marginVertical: 20,
          fontSize: 20,
          color: colors.appWhite,
        }}>
        Physical injuries?
      </Text>

      <Input
        placeholder="e.g. acute or chronic conditions"
        style={{
          height: 100,
          textAlignVertical: 'top',
          marginHorizontal: 10,
        }}
        multiline
        onChangeText={setInjuries}
        defaultValue={injuries}
      />
    </KeyboardAwareScrollView>
  );
};

export default PhysicalInjuries;
