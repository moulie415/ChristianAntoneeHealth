import React, {useState} from 'react';
import {
  Alert,
  TouchableOpacity,
  Image,
  Platform,
  KeyboardAvoidingView,
  View,
  ImageBackground,
  StyleSheet,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Spinner, Input, Button, Text} from '@ui-kitten/components';
import auth from '@react-native-firebase/auth';
import {Layout} from '@ui-kitten/components';
import {connect} from 'react-redux';
import styles from '../../styles/views/Login';
import LoginProps from '../../types/views/Login';
import {MyRootState} from '../../types/Shared';
import appleAuth from '@invertase/react-native-apple-authentication';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {GoogleSignin} from '@react-native-community/google-signin';
import {handleAuth} from '../../actions/profile';
import DevicePixels from '../../helpers/DevicePixels';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImageOverlay from '../commons/ImageOverlay';
import colors from '../../constants/colors';

GoogleSignin.configure({
  webClientId:
    '48631950986-ibg0u91q5m6hsllkunhe9frf00id7r8c.apps.googleusercontent.com', // From Firebase Console Settings
});

const Login: React.FC<LoginProps> = ({
  navigation,
  handleAuth: handleAuthAction,
}) => {
  const [spinner, setSpinner] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [secure, setSecure] = useState(true);
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');

  const signIn = async (email: string, password: string) => {
    try {
      return await auth().signInWithEmailAndPassword(email, password);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

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
      <KeyboardAwareScrollView
        contentContainerStyle={{flex: 1, justifyContent: 'flex-end'}}>
        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
            paddingVertical: DevicePixels[20],
          }}
          category="h5">
          Log in now
        </Text>

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
              marginHorizontal: DevicePixels[10],
              marginBottom: DevicePixels[5],
              borderColor: '#fff',
            }}
            accessoryLeft={() =>
              appleLoading ? (
                <Spinner />
              ) : (
                <Icon name="apple" color="#fff" size={DevicePixels[20]} />
              )
            }>
            Apple
          </Button>
        )}
        <Button
          onPress={async () => {
            setFacebookLoading(true);
            await facebookSignIn();
            setFacebookLoading(false);
          }}
          style={{
            backgroundColor: 'transparent',
            height: DevicePixels[50],
            marginHorizontal: DevicePixels[10],
            marginBottom: DevicePixels[5],
            borderColor: '#fff',
          }}
          accessoryLeft={() =>
            facebookLoading ? (
              <Spinner />
            ) : (
              <Icon color="#fff" name="facebook-f" size={DevicePixels[20]} />
            )
          }>
          Facebook
        </Button>
        <Button
          onPress={async () => {
            setGoogleLoading(true);
            await googleSignIn();
            setGoogleLoading(false);
          }}
          style={{
            backgroundColor: 'transparent',
            height: DevicePixels[50],
            marginHorizontal: DevicePixels[10],
            marginBottom: DevicePixels[5],
            borderColor: '#fff',
          }}
          accessoryLeft={() =>
            googleLoading ? (
              <Spinner />
            ) : (
              <Icon color="#fff" name="google" size={DevicePixels[20]} />
            )
          }>
          Google
        </Button>
        <TextInput
          style={[
            styles.input,
            {
              borderTopLeftRadius: DevicePixels[5],
              borderTopRightRadius: DevicePixels[5],
            },
          ]}
          placeholder="Email"
          onChangeText={u => setUsername(u)}
          placeholderTextColor="#fff"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />
        <TextInput
          style={[
            styles.input,
            {
              borderBottomLeftRadius: DevicePixels[5],
              borderBottomRightRadius: DevicePixels[5],
            },
          ]}
          placeholder="Password"
          secureTextEntry={secure}
          placeholderTextColor="#fff"
          onChangeText={p => setPass(p)}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <Button
          onPress={async () => {
            if (username && pass) {
              setSpinner(true);
              setSecure(true);
              const {user} = await signIn(username, pass);
              if (!user.emailVerified) {
                Alert.alert(
                  'Sorry',
                  'You must first verify your email using the link we sent you before logging in',
                );
              } else {
                handleAuthAction(user);
              }
            } else {
              Alert.alert(
                'Sorry',
                'Please enter both your email and your password',
              );
            }
            setSpinner(false);
          }}
          accessoryLeft={() => (spinner ? <Spinner /> : null)}
          style={styles.button}>
          Log in
        </Button>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: DevicePixels[15],
            marginBottom: DevicePixels[20],
          }}>
          <Text style={{color: '#fff'}}>Not signed up yet? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text
              style={{
                fontWeight: 'bold',
                color: '#fff',
                textDecorationLine: 'underline',
              }}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  loggedIn: profile.loggedIn,
});

const mapDispatchToProps = {
  handleAuth,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
