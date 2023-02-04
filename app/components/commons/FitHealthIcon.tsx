import {Image, Platform, TouchableOpacity, Linking} from 'react-native';
import React from 'react';

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
            width: 25,
            height: 25,
          }}
          source={require('../../images/health.png')}
        />
      ) : (
        <Image
          style={{
            width: 24,
            height: 20,
          }}
          source={require('../../images/fit.png')}
        />
      )}
    </TouchableOpacity>
  );
};

export default FitHealthIcon;
