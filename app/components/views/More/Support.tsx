import React from 'react';
import {
  View,
  Linking,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import DevicePixels from '../../../helpers/DevicePixels';
import SupportProps from '../../../types/views/Support';
import Button from '../../commons/Button';
import Header from '../../commons/Header';
import Instabug from 'instabug-reactnative';
import Text from '../../commons/Text';
import colors from '../../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Support: React.FC<SupportProps> = () => {
  return (
    <FastImage
      source={require('../../../images/login.jpeg')}
      blurRadius={7}
      style={{flex: 1}}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: '#000',
          opacity: 0.7,
        }}
      />
      <SafeAreaView style={{flex: 1}}>
        <Header hasBack title="Support" />

        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://christianantonee.com/privacy-policy')
          }
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: DevicePixels[10],
          }}>
          <View
            style={{
              height: DevicePixels[35],
              width: DevicePixels[35],
              backgroundColor: '#212121',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: DevicePixels[5],
            }}>
            <Icon
              size={DevicePixels[20]}
              color={colors.appWhite}
              solid
              name="check-circle"
            />
          </View>
          <Text
            style={{
              color: colors.appWhite,
              fontSize: DevicePixels[18],
              fontWeight: 'bold',
              marginLeft: DevicePixels[15],
            }}>
            Privacy policy
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Instabug.show()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: DevicePixels[10],
          }}>
          <View
            style={{
              height: DevicePixels[35],
              width: DevicePixels[35],
              backgroundColor: '#212121',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: DevicePixels[5],
            }}>
            <Icon
              size={DevicePixels[20]}
              color={colors.appWhite}
              solid
              name="bug"
            />
          </View>
          <Text
            style={{
              color: colors.appWhite,
              fontSize: DevicePixels[18],
              fontWeight: 'bold',
              marginLeft: DevicePixels[15],
            }}>
            Report a problem
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            try {
              Linking.openURL(
                'mailto:info@christianantonee.com?subject=CA Health',
              );
            } catch (e) {
              Linking.openURL('https://christianantonee.com/contact');
            }
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: DevicePixels[10],
          }}>
          <View
            style={{
              height: DevicePixels[35],
              width: DevicePixels[35],
              backgroundColor: '#212121',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: DevicePixels[5],
            }}>
            <Icon
              size={DevicePixels[20]}
              color={colors.appWhite}
              solid
              name="envelope"
            />
          </View>
          <Text
            style={{
              color: colors.appWhite,
              fontSize: DevicePixels[18],
              fontWeight: 'bold',
              marginLeft: DevicePixels[15],
            }}>
            Contact us
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </FastImage>
  );
};

export default Support;
