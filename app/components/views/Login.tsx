import React, {useState} from 'react';
import {
  TouchableOpacity,
  Image,
  Platform,
  View,
  ImageBackground,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Spinner, Button} from '@ui-kitten/components';
import Swiper from 'react-native-swiper';
import {Layout} from '@ui-kitten/components';
import {connect} from 'react-redux';
import styles from '../../styles/views/Login';
import LoginProps from '../../types/views/Login';
import {MyRootState} from '../../types/Shared';
import DevicePixels from '../../helpers/DevicePixels';
import {signUp} from '../../actions/profile';
import colors from '../../constants/colors';
import Text from '../commons/Text';
import {appleSignIn, facebookSignIn, googleSignIn} from '../../helpers/auth';
import appleAuth from '@invertase/react-native-apple-authentication';
import ImageOverlay from '../commons/ImageOverlay';

const Login: React.FC<LoginProps> = ({navigation}) => {
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const signInApple = async () => {
    try {
      setAppleLoading(true);
      await appleSignIn();
    } catch (e) {
      setAppleLoading(false);
    }
  };

  const signInFacebook = async () => {
    try {
      setFacebookLoading(true);
      await facebookSignIn();
    } catch (e) {
      setFacebookLoading(false);
    }
  };

  const signInGoogle = async () => {
    try {
      setGoogleLoading(true);
      await googleSignIn();
    } catch (e) {
      setGoogleLoading(false);
    }
  };

  const disabled = facebookLoading || googleLoading || appleLoading;

  return (
    <ImageBackground
      source={require('../../images/login.jpeg')}
      blurRadius={5}
      style={{flex: 1}}>
      <View style={styles.logoContainer}>
        <View
          style={{
            width: DevicePixels[200],
            height: DevicePixels[200],
            borderRadius: DevicePixels[100],
            backgroundColor: 'rgba(255,255,255, 0.2)',
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: DevicePixels[175],
              height: DevicePixels[175],
              borderRadius: DevicePixels[90],
              backgroundColor: colors.appWhite,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../../images/logo.png')}
              style={{width: DevicePixels[85], height: DevicePixels[75]}}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: DevicePixels[30],
          left: 0,
          right: 0,
        }}>
        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
            paddingVertical: DevicePixels[10],
          }}>
          Continue with
        </Text>
        <View style={{flexDirection: 'row'}}>
          {Platform.OS === 'ios' && appleAuth.isSupported && (
            <Button
              disabled={disabled}
              onPress={signInApple}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                height: DevicePixels[50],
                marginHorizontal: DevicePixels[5],
                marginLeft: DevicePixels[10],
                marginBottom: DevicePixels[5],
                borderColor: '#fff',
              }}
              accessoryLeft={() =>
                appleLoading ? (
                  <Spinner />
                ) : (
                  <Icon name="apple" color="#fff" size={DevicePixels[20]} />
                )
              }
            />
          )}
          <Button
            onPress={signInFacebook}
            disabled={disabled}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              height: DevicePixels[50],
              marginHorizontal: DevicePixels[5],
              marginLeft:
                Platform.OS === 'ios' ? DevicePixels[5] : DevicePixels[10],
              marginBottom: DevicePixels[5],
              borderColor: '#fff',
            }}
            accessoryLeft={() =>
              facebookLoading ? (
                <Spinner />
              ) : (
                <Icon color="#fff" name="facebook-f" size={DevicePixels[20]} />
              )
            }
          />
          <Button
            onPress={signInGoogle}
            disabled={disabled}
            style={{
              backgroundColor: 'transparent',
              height: DevicePixels[50],
              marginHorizontal: DevicePixels[5],
              marginRight: DevicePixels[10],
              marginBottom: DevicePixels[5],
              borderColor: '#fff',
              flex: 1,
            }}
            accessoryLeft={() =>
              googleLoading ? (
                <Spinner />
              ) : (
                <Icon color="#fff" name="google" size={DevicePixels[20]} />
              )
            }
          />
        </View>
        <TouchableOpacity
          style={{margin: DevicePixels[20], alignSelf: 'center'}}
          onPress={() => navigation.navigate('SignUp')}>
          <Text
            variant="bold"
            style={{
              color: '#fff',
              textDecorationLine: 'underline',
            }}>
            Log in
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginBottom: DevicePixels[20], alignSelf: 'center'}}
          onPress={() => {
            navigation.navigate('SignUpFlow', {dry: true});
          }}>
          <Text
            variant="bold"
            style={{
              color: '#fff',
              textDecorationLine: 'underline',
            }}>
            Sign up with email
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  loggedIn: profile.loggedIn,
});

const mapDispatchToProps = {
  signUp,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
