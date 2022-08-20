import React from 'react';
import {ImageBackground, Linking, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../../constants/colors';
import DevicePixels from '../../../helpers/DevicePixels';
import Header from '../../commons/Header';
import Text from '../../commons/Text';

const Policies = () => {
  return (
    <FastImage
      source={require('../../../images/old-black-background-grunge.png')}
      blurRadius={5}
      style={{flex: 1}}>
      <SafeAreaView>
        <Header hasBack title="Policies and Terms" />
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://christianantonee.com/privacy-policy')
          }
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: DevicePixels[20],
          }}>
          <Icon
            style={{marginLeft: DevicePixels[20]}}
            name="file"
            color={colors.appWhite}
            size={DevicePixels[30]}
          />
          <Text
            style={{
              color: colors.appWhite,
              fontWeight: 'bold',
              marginLeft: DevicePixels[10],
              textDecorationLine: 'underline'
            }}>
            Privacy Policy
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </FastImage>
  );
};

export default Policies;
