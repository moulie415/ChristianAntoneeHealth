import React from 'react';
import Text from '../../commons/Text';

import colors from '../../../constants/colors';
import Input from '../../commons/Input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const Occupation: React.FC<{
  occupation: string;
  setOccupation: (occupation: string) => void;
}> = ({occupation, setOccupation}) => {
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
          width: 250,
          color: colors.appWhite,
          fontSize: 20,
        }}>
        Occupation?
      </Text>

      <Input
        placeholder="e.g. Doctor, lawyer..."
        value={occupation}
        onChangeText={setOccupation}
        style={{marginHorizontal: 10}}
      />
    </KeyboardAwareScrollView>
  );
};

export default Occupation;
