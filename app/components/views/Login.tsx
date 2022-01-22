import React, {useState} from 'react';
import {
  Alert,
  TouchableOpacity,
  Image,
  Platform,
  View,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Spinner, Button, Text} from '@ui-kitten/components';
import auth from '@react-native-firebase/auth';
import {Layout} from '@ui-kitten/components';
import {connect} from 'react-redux';
import styles from '../../styles/views/Login';
import LoginProps from '../../types/views/Login';
import {MyRootState} from '../../types/Shared';
import appleAuth from '@invertase/react-native-apple-authentication';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {GoogleSignin} from '@react-native-community/google-signin';
import DevicePixels from '../../helpers/DevicePixels';
import {setStep, signUp} from '../../actions/profile';

GoogleSignin.configure({
  webClientId:
    '48631950986-ibg0u91q5m6hsllkunhe9frf00id7r8c.apps.googleusercontent.com', // From Firebase Console Settings
});

const Login: React.FC<LoginProps> = ({navigation, setStep: setStepAction}) => {
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
      setAppleLoading(false);
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
      return credentials;
    } catch (e) {
      console.log({e});
      setGoogleLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../images/login.jpeg')}
      style={{flex: 1}}>
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

      <View style={{justifyContent: 'flex-end', flex: 1}}>
        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
            paddingVertical: DevicePixels[20],
          }}
          category="h5">
          Continue with
        </Text>
        <View style={{flexDirection: 'row'}}>
          {Platform.OS === 'ios' && (
            <Button
              onPress={async () => {
                setAppleLoading(true);
                await appleSignIn();
              }}
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
            onPress={async () => {
              setFacebookLoading(true);
              await facebookSignIn();
            }}
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
            onPress={async () => {
              setGoogleLoading(true);
              await googleSignIn();
            }}
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
            style={{
              fontWeight: 'bold',
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
            setStepAction(0);
          }}>
          <Text
            style={{
              fontWeight: 'bold',
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
  setStep,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
