import React, {useState} from 'react';
import {
  TouchableOpacity,
  Image,
  Platform,
  View,
  ImageBackground,
  StyleSheet,
  ImageSourcePropType,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import LoginProps from '../../types/views/Login';
import {MyRootState} from '../../types/Shared';
import DevicePixels from '../../helpers/DevicePixels';
import {signUp} from '../../actions/profile';
import colors from '../../constants/colors';
import Text from '../commons/Text';
import {appleSignIn, facebookSignIn, googleSignIn} from '../../helpers/auth';
import appleAuth from '@invertase/react-native-apple-authentication';
import Input from '../commons/Input';
import Button from '../commons/Button';
import GoogleLogo from '../../images/google.svg';
import Spinner from '../commons/Spinner';

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
      style={{
        flex: 1,
      }}>
      <KeyboardAvoidingView style={{flex: 1}} behavior="position">
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: colors.appBlack,
            opacity: 0.5,
          }}
        />
        <View style={{}}>
          <View
            style={{
              width: DevicePixels[200],
              height: DevicePixels[200],
              borderRadius: DevicePixels[100],
              backgroundColor: 'rgba(255,255,255, 0.2)',
              justifyContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
              marginTop: DevicePixels[50],
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
                style={{width: DevicePixels[100], height: DevicePixels[88]}}
              />
            </View>
          </View>

          <Input
            style={{
              marginHorizontal: DevicePixels[20],
              marginTop: DevicePixels[30],
              padding: DevicePixels[20],
            }}
            placeholder="Email"
            placeholderTextColor={colors.appWhite}
          />
          <Input
            style={{
              marginHorizontal: DevicePixels[20],
              marginTop: DevicePixels[20],
              padding: DevicePixels[20],
            }}
            placeholder="Password"
            placeholderTextColor={colors.appWhite}
          />
          <Button
            text="Log in"
            style={{
              marginHorizontal: DevicePixels[20],
              marginTop: DevicePixels[20],
            }}
          />
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              paddingVertical: DevicePixels[10],
            }}>
            OR
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            {Platform.OS === 'ios' && appleAuth.isSupported && (
              <TouchableOpacity
                disabled={disabled}
                onPress={signInApple}
                style={{
                  height: DevicePixels[70],
                  width: DevicePixels[70],
                  marginHorizontal: DevicePixels[5],
                  marginLeft: DevicePixels[10],
                  marginBottom: DevicePixels[5],
                  borderColor: '#36415F',
                  borderWidth: DevicePixels[2],
                  borderRadius: DevicePixels[20],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {appleLoading ? (
                  <Spinner />
                ) : (
                  <Icon name="apple" color="#fff" size={DevicePixels[35]} />
                )}
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={signInFacebook}
              disabled={disabled}
              style={{
                height: DevicePixels[70],
                width: DevicePixels[70],
                marginHorizontal: DevicePixels[5],
                marginLeft:
                  Platform.OS === 'ios' ? DevicePixels[5] : DevicePixels[10],
                marginBottom: DevicePixels[5],
                borderColor: '#36415F',
                borderWidth: DevicePixels[2],
                borderRadius: DevicePixels[20],
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {facebookLoading ? (
                <Spinner />
              ) : (
                <Icon color="#fff" name="facebook-f" size={DevicePixels[35]} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={signInGoogle}
              disabled={disabled}
              style={{
                height: DevicePixels[70],
                width: DevicePixels[70],
                marginHorizontal: DevicePixels[5],
                marginRight: DevicePixels[10],
                marginBottom: DevicePixels[5],
                borderColor: '#36415F',
                borderWidth: DevicePixels[2],
                borderRadius: DevicePixels[20],
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {googleLoading ? (
                <Spinner />
              ) : (
                <GoogleLogo width={DevicePixels[35]} />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{marginTop: DevicePixels[20], alignSelf: 'center'}}
            onPress={() => {
              navigation.navigate('SignUp');
            }}>
            <Text style={{color: 'rgba(255, 255, 255, 0.56)'}}>
              {"Don't have an account? "}
              <Text
                variant="bold"
                style={{
                  color: '#fff',
                }}>
                Sign up
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
