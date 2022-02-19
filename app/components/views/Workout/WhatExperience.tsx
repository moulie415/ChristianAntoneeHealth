import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import colors from '../../../constants/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Layout} from '@ui-kitten/components';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';

const WhatExperience: React.FC = () => {
  return (
    <ImageBackground
      source={require('../../../images/1st_Carousel_image_targeted_workouts.jpeg')}
      style={{flex: 1}}>
      <Layout
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: '#000',
          opacity: 0.7,
        }}
      />
      <SafeAreaView style={{flex: 1}}>
        <Text
          style={{
            color: colors.appWhite,
            textAlign: 'center',
            marginTop: DevicePixels[20],
          }}
          category="h3">
          What's your experience level?
        </Text>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={() => 0}
            style={{
              margin: DevicePixels[20],
              marginTop: 0,
              backgroundColor: colors.appBlue,
              padding: DevicePixels[10],
              borderColor: colors.appBlue,
              borderWidth: DevicePixels[1],
              borderRadius: DevicePixels[5],
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: colors.appWhite,
              }}>
              No clue what I’m doing
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => 0}
            style={{
              margin: DevicePixels[20],
              backgroundColor: colors.appBlue,
              padding: DevicePixels[10],
              borderColor: colors.appBlue,
              borderWidth: DevicePixels[1],
              borderRadius: DevicePixels[5],
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: colors.appWhite,
              }}>
              I workout every now and again
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => 0}
            style={{
              margin: DevicePixels[20],
              backgroundColor: colors.appBlue,
              padding: DevicePixels[10],
              borderColor: colors.appBlue,
              borderWidth: DevicePixels[1],
              borderRadius: DevicePixels[5],
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: colors.appWhite,
              }}>
              I’m a seasoned veteran
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default WhatExperience;
