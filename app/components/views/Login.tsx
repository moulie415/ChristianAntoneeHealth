import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {Image, Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import {StackParamList} from '../../App';
import colors from '../../constants/colors';
import {appleSignIn, facebookSignIn, googleSignIn} from '../../helpers/api';
import GoogleIcon from '../../images/google.svg';
import {handleAuth, signUp} from '../../reducers/profile';
import Button from '../commons/Button';
import Text from '../commons/Text';

const Login: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Login'>;
  handleAuth: (user: FirebaseAuthTypes.User) => void;
}> = ({navigation, handleAuth: handleAuthAction}) => {
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const signInApple = async () => {
    try {
      setAppleLoading(true);
      await appleSignIn(handleAuthAction);
    } catch (e) {
      setAppleLoading(false);
    }
  };

  const signInFacebook = async () => {
    try {
      setFacebookLoading(true);
      await facebookSignIn(handleAuthAction);
    } catch (e) {
      setFacebookLoading(false);
    }
  };

  const signInGoogle = async () => {
    try {
      setGoogleLoading(true);
      await googleSignIn(handleAuthAction);
    } catch (e) {
      setGoogleLoading(false);
    }
  };

  const disabled = facebookLoading || googleLoading || appleLoading;

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
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="always">
          <View style={{}}>
            <View
              style={{
                width: 175,
                height: 175,
                borderRadius: 90,
                backgroundColor: 'rgba(255,255,255, 0.2)',
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                marginTop: 60,
              }}>
              <View
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 75,
                  backgroundColor: colors.appWhite,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={require('../../images/logo.png')}
                  style={{width: 90, height: 79}}
                />
              </View>
            </View>

            <Button
              text="Log in with email"
              style={{
                marginHorizontal: 20,
                marginTop: 60,
              }}
              onPress={() => navigation.navigate('LoginEmail')}
            />
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
                paddingVertical: 10,
              }}>
              OR
            </Text>
            {Platform.OS === 'ios' && appleAuth.isSupported && (
              <AppleButton
                buttonStyle={AppleButton.Style.WHITE}
                buttonType={AppleButton.Type.CONTINUE}
                onPress={() => !disabled && signInApple()}
                style={{height: 50, marginHorizontal: 20}}
              />
            )}

            <Button
              onPress={signInFacebook}
              disabled={disabled}
              icon="facebook"
              text="Continue with Facebook"
              overrideCasing
              iconColor="#1877F2"
              textStyle={{fontSize: 18, color: "#1877F2"}}
              style={{
                marginTop: 20,
                marginHorizontal: 20,
                backgroundColor: colors.appWhite,
                borderRadius: 5,
                borderColor: '#1877F2',
                borderWidth: 1,
              }}
            />

            <Button
              onPress={signInGoogle}
              icon={
                <GoogleIcon style={{marginRight: 10}} height={20} width={20} />
              }
              disabled={disabled}
              text="Continue with Google"
              overrideCasing
              textStyle={{color: '#1F1F1F', fontSize: 18}}
              style={{
                marginTop: 20,
                marginHorizontal: 20,
                backgroundColor: colors.appWhite,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#747775',
              }}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </FastImage>
  );
};

const mapDispatchToProps = {
  signUp,
  handleAuth,
};

export default connect(null, mapDispatchToProps)(Login);
