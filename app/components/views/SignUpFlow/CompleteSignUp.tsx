import {
  Alert,
  ImageBackground,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';

import Button from '../../commons/Button';
import Text from '../../commons/Text';
import colors from '../../../constants/colors';
import Checkbox from '../../commons/Checkbox';

const CompleteSignUp: React.FC<{
  completeSignUp: () => void;
  loading: boolean;
  marketing: boolean;
  setMarketing: (marketing: boolean) => void;
}> = ({completeSignUp, loading, marketing, setMarketing}) => {
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  return (
    <View
      style={{
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
        Almost there...
      </Text>
      <View style={{marginLeft: 10}}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginBottom: 10,
            alignItems: 'center',
          }}
          onPress={() => setPrivacy(!privacy)}>
          <Checkbox
            checked={privacy}
            onPress={() => setPrivacy(!privacy)}
            iconStyle={{color: colors.appWhite}}
          />
          <Text style={{marginLeft: 10, color: colors.appWhite}}>
            I've read the{' '}
            <Text
              onPress={() => {
                Linking.openURL('https://christianantonee.com/privacy-policy');
              }}
              style={{
                textDecorationLine: 'underline',
                fontWeight: 'bold',
                color: colors.appWhite,
              }}>
              Privacy Policy
            </Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMarketing(!marketing)}
          style={{
            flexDirection: 'row',
            marginBottom: 20,
            alignItems: 'center',
          }}>
          <Checkbox
            checked={marketing}
            onPress={() => setMarketing(!marketing)}
            iconStyle={{color: colors.appWhite}}
          />
          <Text style={{marginLeft: 10, color: colors.appWhite}}>
            I want to join the CA Health mailing list and receive relevant
            articles offers and promotions
          </Text>
        </TouchableOpacity>
      </View>
      <Button
        text="Complete my profile"
        onPress={completeSignUp}
        disabled={loading || !privacy}
        loading={loading}
      />
    </View>
  );
};

export default CompleteSignUp;
