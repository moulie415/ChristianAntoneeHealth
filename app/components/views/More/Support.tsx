import {Button, Layout} from '@ui-kitten/components';
import React from 'react';
import {View, Text, Linking} from 'react-native';
import DevicePixels from '../../../helpers/DevicePixels';
import SupportProps from '../../../types/views/Support';

const Support: React.FC<SupportProps> = () => {
  return (
    <Layout style={{flex: 1}}>
      <Text />
      <View style={{justifyContent: 'flex-end', flex: 1}}>
        <Button
          onPress={() =>
            Linking.openURL('https://healthandmovement.co.uk/contact')
          }
          style={{margin: DevicePixels[10], marginBottom: DevicePixels[20]}}>
          Contact Us
        </Button>
      </View>
    </Layout>
  );
};

export default Support;
