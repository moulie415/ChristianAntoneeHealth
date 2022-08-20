import React from 'react';
import {View, Linking, ImageBackground} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import DevicePixels from '../../../helpers/DevicePixels';
import SupportProps from '../../../types/views/Support';
import Button from '../../commons/Button';
import Header from '../../commons/Header';

const Support: React.FC<SupportProps> = () => {
  return (
    <FastImage
      source={require('../../../images/old-black-background-grunge.png')}
      blurRadius={5}
      style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <Header hasBack title="Support" />
        <View style={{justifyContent: 'flex-end', flex: 1}}>
          <Button
            text="Contact Us"
            onPress={() =>
              Linking.openURL('https://christianantonee.com/contact')
            }
            style={{
              margin: DevicePixels[20],
            }}
          />
        </View>
      </SafeAreaView>
    </FastImage>
  );
};

export default Support;
