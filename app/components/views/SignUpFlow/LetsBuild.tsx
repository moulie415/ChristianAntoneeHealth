import {ImageBackground, StyleSheet, View} from 'react-native';
import React from 'react';
import Text from '../../commons/Text';
import colors from '../../../constants/colors';
import DevicePixels from '../../../helpers/DevicePixels';

const LetsBuild: React.FC = () => {
  return (
    <ImageBackground
      source={require('../../../images/login.jpeg')}
      blurRadius={5}
      style={{
        flex: 1,
      }}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.appBlack,
          opacity: 0.5,
        }}
      />
      <View
        style={{flex: 1, justifyContent: 'center', margin: DevicePixels[40]}}>
        <Text
     
          style={{
            color: colors.appWhite,
            textAlign: 'center',
            fontSize: DevicePixels[20],
            marginBottom: DevicePixels[10],
            fontWeight: 'bold',
          }}>
          Let's build your profile
        </Text>
        <Text style={{color: colors.appWhite, textAlign: 'center'}}>
          This will help us tailor you a custom workout plan should you choose
          to request one (Swipe from right to continue)
        </Text>
      </View>
    </ImageBackground>
  );
};

export default LetsBuild;
