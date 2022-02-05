import {View} from 'react-native';
import React, {useState} from 'react';
import DevicePixels from '../../../helpers/DevicePixels';
import Button from '../../commons/Button';
import { CheckBox } from '@ui-kitten/components';
import Text from '../../commons/Text';

const CompleteSignUp: React.FC<{
  completeSignUp: () => void;
  loading: boolean;
  marketing: boolean;
  setMarketing: (marketing: boolean) => void;
}> = ({completeSignUp, loading, marketing}) => {
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  return (
    <View>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: DevicePixels[175],
        }}>
          <CheckBox>I've read the <Text></Text></CheckBox>
          <CheckBox></CheckBox>
          <CheckBox></CheckBox>
        <Button onPress={completeSignUp} disabled={loading || !terms || !privacy}>
          Complete sign up
        </Button>
      </View>
    </View>
  );
};

export default CompleteSignUp;
