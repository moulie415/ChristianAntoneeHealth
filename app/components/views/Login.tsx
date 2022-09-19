import React, {useState} from 'react';
import {
  TouchableOpacity,
  Image,
  Platform,
  View,
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import LoginProps from '../../types/views/Login';
import {MyRootState} from '../../types/Shared';
import DevicePixels from '../../helpers/DevicePixels';
import {handleAuth, signUp} from '../../actions/profile';
import colors from '../../constants/colors';
import Text from '../commons/Text';
import {
  appleSignIn,
  facebookSignIn,
  googleSignIn,
  signIn,
} from '../../helpers/api';
import appleAuth from '@invertase/react-native-apple-authentication';
import Input from '../commons/Input';
import Button from '../commons/Button';
import GoogleLogo from '../../images/google.svg';
import Spinner from '../commons/Spinner';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';

const Login: React.FC<LoginProps> = ({
  navigation,
  handleAuth: handleAuthAction,
}) => {
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

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

  const signInEmail = async () => {
    try {
      setLoading(true);
      await signIn(email, pass, handleAuthAction);
    } catch (e) {
      setLoading(false);
    }
  };

  const disabled = facebookLoading || googleLoading || appleLoading || loading;

  return (
    <FastImage
      source={require('../../images/login.jpeg')}
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
      <SafeAreaView>
        <KeyboardAwareScrollView>
          <View style={{}}>
            <View
              style={{
                width: DevicePixels[175],
                height: DevicePixels[175],
                borderRadius: DevicePixels[90],
                backgroundColor: 'rgba(255,255,255, 0.2)',
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                marginTop: DevicePixels[60],
              }}>
              <View
                style={{
                  width: DevicePixels[150],
                  height: DevicePixels[150],
                  borderRadius: DevicePixels[75],
                  backgroundColor: colors.appWhite,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={require('../../images/logo.png')}
                  style={{width: DevicePixels[90], height: DevicePixels[79]}}
                />
              </View>
            </View>

            <Input
              onChangeText={setEmail}
              value={email}
              containerStyle={{
                marginHorizontal: DevicePixels[20],
                marginTop: DevicePixels[60],
              }}
              placeholder="Email"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholderTextColor={colors.appWhite}
            />
            <Input
              onChangeText={setPass}
              value={pass}
              containerStyle={{
                marginHorizontal: DevicePixels[20],
                marginTop: DevicePixels[20],
              }}
              placeholder="Password"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={colors.appWhite}
              secure
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              hitSlop={{
                top: DevicePixels[10],
                bottom: DevicePixels[10],
                right: DevicePixels[10],
                left: DevicePixels[10],
              }}
              style={{
                alignSelf: 'flex-end',
                marginRight: DevicePixels[20],
                marginTop: DevicePixels[10],
              }}>
              <Text style={{color: colors.appWhite}}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              disabled={loading}
              loading={loading}
              text="Log in"
              style={{
                marginHorizontal: DevicePixels[20],
                marginTop: DevicePixels[20],
              }}
              onPress={signInEmail}
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
                  borderColor: '#36415F',
                  borderWidth: DevicePixels[2],
                  borderRadius: DevicePixels[20],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {facebookLoading ? (
                  <Spinner />
                ) : (
                  <Icon
                    color="#fff"
                    name="facebook-f"
                    size={DevicePixels[35]}
                  />
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
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                  }}>
                  Sign up
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </FastImage>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  loggedIn: profile.loggedIn,
});

const mapDispatchToProps = {
  signUp,
  handleAuth,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
