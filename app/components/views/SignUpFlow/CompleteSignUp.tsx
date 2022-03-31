import {Alert, Linking, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import DevicePixels from '../../../helpers/DevicePixels';
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
    <View>
      <Text
        category="h4"
        style={{
          textAlign: 'center',
          marginVertical: DevicePixels[20],
          width: DevicePixels[250],
          color: colors.appBlue,
        }}>
        Almost there...
      </Text>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: DevicePixels[200],
          width: DevicePixels[250],
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginBottom: DevicePixels[10],
            alignItems: 'center',
          }}
          onPress={() => setPrivacy(!privacy)}>
          <Checkbox
            checked={privacy}
            onPress={() => setPrivacy(!privacy)}
            iconStyle={{color: colors.appBlue}}
          />
          <Text style={{marginLeft: DevicePixels[10], color: colors.appBlue}}>
            I've read the{' '}
            <Text
              onPress={() =>
                Linking.openURL('https://christianantonee.com/privacy-policy')
              }
              style={{
                textDecorationLine: 'underline',
                fontWeight: 'bold',
                color: colors.appBlue,
              }}>
              Privacy Policy
            </Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMarketing(!marketing)}
          style={{
            flexDirection: 'row',
            marginBottom: DevicePixels[20],
            alignItems: 'center',
          }}>
          <Checkbox
            checked={marketing}
            onPress={() => setMarketing(!marketing)}
            iconStyle={{color: colors.appBlue}}
          />
          <Text style={{marginLeft: DevicePixels[10], color: colors.appBlue}}>
            I want to join the CA Health mailing list and receive relevant
            articles offers and promotions
          </Text>
        </TouchableOpacity>

        <Button onPress={completeSignUp} disabled={loading || !privacy}>
          Get my workout plan!
        </Button>
      </View>
    </View>
  );
};

export default CompleteSignUp;
