import {ImageBackground, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import Text from '../../commons/Text';
import colors from '../../../constants/colors';
import DevicePixels from '../../../helpers/DevicePixels';
import Button from '../../commons/Button';
import FastImage from 'react-native-fast-image';

const WIDTH = DevicePixels[100];

const LetsBuild: React.FC<{goNext: () => void}> = ({goNext}) => {
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
        margin: DevicePixels[10],
      }}
      bounces={false}>
      <Text
        style={{
          color: colors.appWhite,
          textAlign: 'center',
          fontSize: DevicePixels[25],
          marginBottom: DevicePixels[10],
          fontWeight: 'bold',
        }}>
        Welcome to Christian Antonee Health
      </Text>
      <Text
        style={{color: colors.appWhite, textAlign: 'center', lineHeight: 20}}>
        My name is Christian Antonee and I work as a Personal Trainer and
        Osteopath in London, England. My brother-in-law Henry and I developed
        this app together to help people stay fit and strong in the wake of a
        global pandemic. Our vision for this project is to continue to support
        my existing client base here in London, but also to provide a valuable
        tool for the wider health and fitness community. We’re grateful to you
        for letting us be a part of your health and fitness journey, and hope
        trust that CA Health will help you reach your lifestyle goals.
      </Text>
      <FastImage
        source={require('../../../images/christian.jpg')}
        style={{
          width: WIDTH,
          height: WIDTH * 1.5,
          alignSelf: 'center',
          borderRadius: DevicePixels[10],
          marginVertical: DevicePixels[15],
          borderWidth: DevicePixels[2],
          borderColor: colors.textGrey,
        }}
      />
      <Button text="Continue" onPress={goNext} />
    </ScrollView>
  );
};

export default LetsBuild;
