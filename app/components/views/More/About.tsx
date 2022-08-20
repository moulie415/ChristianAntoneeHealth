import React from 'react';
import {
  ImageBackground,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../../constants/colors';
import AboutProps from '../../../types/views/About';
import DevicePixels from '../../../helpers/DevicePixels';
import Text from '../../commons/Text';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../commons/Header';
import FastImage from 'react-native-fast-image';

const About: React.FC<AboutProps> = () => {
  return (
    <>
      <FastImage
        source={require('../../../images/beginner.jpg')}
        blurRadius={3}
        style={{height: DevicePixels[200]}}>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: '#000',
            opacity: 0.7,
          }}
        />
        <SafeAreaView>
          <Header hasBack title="About us" />
        </SafeAreaView>
      </FastImage>
      <FastImage
        source={require('../../../images/old-black-background-grunge.png')}
        style={{
          flex: 1,
          borderTopLeftRadius: DevicePixels[30],
          borderTopRightRadius: DevicePixels[30],
          marginTop: -DevicePixels[30],
        }}>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://christianantonee.com')}>
          <Text
            style={{
              color: colors.appWhite,
              fontWeight: 'bold',
              textDecorationLine: 'underline',
              fontSize: DevicePixels[20],
              textAlign: 'center',
            }}>
            christianantonee.com
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            margin: DevicePixels[10],

            color: colors.appWhite,
          }}>
          {
            'At the age of 16 Christian began his career in the health and fitness industry as a volunteer at a local health club in Ottawa, Canada. It was there that he gained an appreciation for exercise prescription and obtained a qualification as a personal trainer. The next step took him to Vancouver on the West coast of Canada where he completed an undergraduate degree in Kinesiology and Psychology.'
          }
        </Text>
        <Text
          style={{
            margin: DevicePixels[10],

            color: colors.appWhite,
          }}>
          {
            'After returning to the UK Christian obtained a qualification as an Osteopath from the British College of Osteopathic Medicine and is currently pursuing a MSc in Clinical Pain management from The University of Edinburgh. By combining principles in exercise prescription, manual therapy and nutrition Christian takes a movement based approach to treating your pain and dysfunction, with a special interest in repetitive strain injuries, sports injuries and neck/low back pain.'
          }
        </Text>
      </FastImage>
    </>
  );
};

export default About;
