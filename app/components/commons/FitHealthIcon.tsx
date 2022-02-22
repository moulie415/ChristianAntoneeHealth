import {Image, Platform, TouchableOpacity, Linking} from 'react-native';
import React from 'react';
import DevicePixels from '../../helpers/DevicePixels';
import {linkToGoogleFit} from '../../helpers/biometrics';
import GoogleFit from 'react-native-google-fit';

const FitHealthIcon = () => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (Platform.OS === 'ios') {
          Linking.openURL('x-apple-health://');
        } else {
          GoogleFit.isAvailable((err, res) => {
            if (err) {
              return linkToGoogleFit();
            } else {
              res ? GoogleFit.openFit() : linkToGoogleFit();
            }
          });
        }
      }}>
      {Platform.OS === 'ios' ? (
        <Image
          style={{
            width: DevicePixels[25],
            height: DevicePixels[25],
          }}
          source={require('../../images/health.png')}
        />
      ) : (
        <Image
          style={{
            width: DevicePixels[24],
            height: DevicePixels[20],
          }}
          source={require('../../images/fit.png')}
        />
      )}
    </TouchableOpacity>
  );
};

export default FitHealthIcon;
