import React from 'react';
import {View, Text, Linking} from 'react-native';
import DevicePixels from '../../../helpers/DevicePixels';
import SupportProps from '../../../types/views/Support';
import Button from '../../commons/Button';

const Support: React.FC<SupportProps> = () => {
  return (
    <View style={{flex: 1}}>
      <Text />
      <View style={{justifyContent: 'flex-end', flex: 1}}>
        <Button
          text="Contact Us"
          onPress={() =>
            Linking.openURL('https://christianantonee.com/contact')
          }
          style={{
            margin: DevicePixels[10],
            marginBottom: DevicePixels[20],
          }}
        />
      </View>
    </View>
  );
};

export default Support;
