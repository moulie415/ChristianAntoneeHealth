import React, {useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import {Spinner, Layout, Button, Text} from '@ui-kitten/components';
import auth from '@react-native-firebase/auth';
import db from '@react-native-firebase/firestore';
import appleAuth from '@invertase/react-native-apple-authentication';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {GoogleSignin} from '@react-native-community/google-signin';
import styles from '../../styles/views/SignUp';
import colors from '../../constants/colors';
import sStyles from '../../styles/views/More';
import SignUpProps from '../../types/views/SignUp';
import {setStep} from '../../actions/profile';
import DevicePixels from '../../helpers/DevicePixels';
import ImageOverlay from '../commons/ImageOverlay';

const SignUp: React.FC<SignUpProps> = ({
  navigation,
  setStep: setStepAction,
}) => {
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const appleSignIn = async () => {
    try {
      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw 'Apple Sign-In failed - no identify token returned';
      }

      // Create a Firebase credential from the response
      const {identityToken, nonce} = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );

      // Sign the user in with the credential
      return auth().signInWithCredential(appleCredential);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const facebookSignIn = async () => {
    try {
      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }

      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw 'Something went wrong obtaining access token';
      }
      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );
      // Sign-in the user with the credential
      const credentials = await auth().signInWithCredential(facebookCredential);
      setFacebookLoading(false);
      return credentials;
    } catch (e) {
      Alert.alert('Error', e.message);
      setFacebookLoading(false);
    }
  };

  const googleSignIn = async () => {
    // Get the users ID token
    try {
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const credentials = await auth().signInWithCredential(googleCredential);
      setGoogleLoading(false);
      return credentials;
    } catch (e) {
      console.log({e});
    }
  };

  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('../../images/sign-up.jpeg')}>
      <Layout
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: '#000',
          opacity: 0.7,
        }}
      />
      <Image
        style={styles.logo}
        source={require('../../images/logo-and-text.png')}
      />
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        {Platform.OS === 'ios' && (
          <Button
            onPress={async () => {
              setAppleLoading(true);
              await appleSignIn();
              setAppleLoading(false);
            }}
            style={{
              backgroundColor: 'transparent',
              height: DevicePixels[50],
              marginHorizontal: DevicePixels[5],
              marginLeft:
                Platform.OS === 'ios' ? DevicePixels[5] : DevicePixels[10],
              marginBottom: DevicePixels[5],
              borderColor: '#fff',
              flex: 1,
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
        <View style={{flexDirection: 'row'}}>
          <Button
            onPress={async () => {
              setFacebookLoading(true);
              await facebookSignIn();
              setFacebookLoading(false);
            }}
            style={{
              backgroundColor: 'transparent',
              height: DevicePixels[50],
              marginHorizontal: DevicePixels[5],
              marginLeft:
                Platform.OS === 'ios' ? DevicePixels[5] : DevicePixels[10],
              marginBottom: DevicePixels[5],
              borderColor: '#fff',
              flex: 1,
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
            onPress={async () => {
              setGoogleLoading(true);
              await googleSignIn();
              setGoogleLoading(false);
            }}
            style={{
              backgroundColor: 'transparent',
              height: DevicePixels[50],
              marginHorizontal: DevicePixels[5],
              marginRight: DevicePixels[10],
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
        <Button
          onPress={async () => {
            navigation.navigate('SignUpFlow', {dry: true});
            setStepAction(0);
          }}
          style={styles.button}>
          Sign up with email
        </Button>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: DevicePixels[15],
          marginBottom: DevicePixels[20],
          flex: 1,
        }}>
        <Text style={{color: '#fff'}}>Already signed up? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text
            style={{
              fontWeight: 'bold',
              color: '#fff',
              textDecorationLine: 'underline',
            }}>
            Log in
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const mapDispatchToProps = {
  setStep,
};

export default connect(null, mapDispatchToProps)(SignUp);
