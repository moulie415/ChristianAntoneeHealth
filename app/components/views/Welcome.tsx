import React from 'react';
import {View, Image, ImageBackground} from 'react-native';
import {Button, Layout, Text} from '@ui-kitten/components';
import VersionNumber from 'react-native-version-number';
import {connect} from 'react-redux';
import styles from '../../styles/views/Welcome';
import WelcomeProps from '../../types/views/Welcome';
import DevicePixels from '../../helpers/DevicePixels';

const Welcome: React.FC<WelcomeProps> = ({navigation}) => {
  return (
    <ImageBackground
      style={{width: '100%', height: '100%'}}
      source={require('../../images/oap_training.png')}>
      <Image
        style={styles.logo}
        source={require('../../images/health_and_movement_logo_colour_centred.png')}
      />
      <Text category="h4" style={{color: '#000', textAlign: 'center'}}>
        Welcome to Health and Movement!
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: DevicePixels[60],
        }}>
        <Button
          style={{width: '40%', backgroundColor: '#000'}}
          onPress={() => navigation.navigate('Login')}>
          Log In
        </Button>
        <Button
          style={{width: '40%'}}
          onPress={() => navigation.navigate('SignUp')}>
          Sign Up
        </Button>
      </View>
      <Text
        style={
          styles.versionNumber
        }>{`v${VersionNumber.appVersion} (${VersionNumber.buildVersion})`}</Text>
    </ImageBackground>
  );
};

export default connect(null)(Welcome);
