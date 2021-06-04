import React, {FunctionComponent, useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TextInput,
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

const SignUp: FunctionComponent<SignUpProps> = ({navigation}) => {
  const [spinner, setSpinner] = useState(false);
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
    <Layout style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../../images/health_and_movement_logo_colour_centred.png')}
      />
      <Text style={{textAlign: 'center', marginBottom: 50}} category="h4">
        Welcome back!
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 30,
        }}>
        <Text>Not a member? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{textDecorationLine: 'underline', fontWeight: 'bold'}}>
            LOG IN
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={{textAlign: 'center', marginBottom: 20}}>
        Get started with
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 20,
        }}>
        {Platform.OS === 'ios' && (
          <Button
            onPress={async () => {
              setAppleLoading(true);
              await appleSignIn();
              setAppleLoading(false);
            }}
            style={{
              backgroundColor: '#fff',
              alignSelf: 'center',
              width: 75,
              height: 50,
              marginHorizontal: 10,
            }}
            accessoryLeft={() =>
              appleLoading ? <Spinner /> : <Icon name="apple" size={20} />
            }
          />
        )}
        <Button
          onPress={async () => {
            setFacebookLoading(true);
            await facebookSignIn();
            setFacebookLoading(false);
          }}
          style={{
            backgroundColor: '#fff',
            alignSelf: 'center',
            width: 75,
            height: 50,
            marginHorizontal: 10,
          }}
          accessoryLeft={() =>
            facebookLoading ? (
              <Spinner />
            ) : (
              <Icon color="#3b5998" name="facebook-f" size={20} />
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
            backgroundColor: '#fff',
            alignSelf: 'center',
            width: 75,
            height: 50,
            marginHorizontal: 10,
          }}
          accessoryLeft={() =>
            googleLoading ? (
              <Spinner />
            ) : (
              <Icon color="#ea4335" name="google" size={20} />
            )
          }
        />
      </View>
      <Text style={{textAlign: 'center', marginBottom: 20}}>or</Text>

      <Button
        onPress={async () => {
          navigation.navigate('SignUpFlow', {dry: true});
        }}
        accessoryLeft={() => (spinner ? <Spinner /> : null)}
        style={styles.button}>
        Sign up with email
      </Button>
    </Layout>
  );
};

export default connect()(SignUp);
