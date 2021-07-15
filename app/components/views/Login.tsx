import React, {useState, useEffect} from 'react';
import {
  Alert,
  View,
  TouchableOpacity,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Spinner, Input, Button, Text} from '@ui-kitten/components';
import auth from '@react-native-firebase/auth';
import {Layout} from '@ui-kitten/components';
import {connect} from 'react-redux';
import styles from '../../styles/views/Login';
import sStyles from '../../styles/views/More';
import colors from '../../constants/colors';
import LoginProps from '../../types/views/Login';
import str from '../../constants/strings';
import {setProfile} from '../../actions/profile';
import Profile from '../../types/Profile';
import {MyRootState} from '../../types/Shared';
import {CommonActions} from '@react-navigation/native';
import appleAuth from '@invertase/react-native-apple-authentication';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {GoogleSignin} from '@react-native-community/google-signin';

GoogleSignin.configure({
  webClientId:
    '48631950986-ibg0u91q5m6hsllkunhe9frf00id7r8c.apps.googleusercontent.com', // From Firebase Console Settings
});

const Login: React.FC<LoginProps> = ({navigation}) => {
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
    <KeyboardAvoidingView behavior="position" style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../../images/health_and_movement_logo_colour_centred.png')}
      />
      <Text style={{textAlign: 'center', marginBottom: 50}} category="h4">
        Welcome back!
      </Text>
      <Layout
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 30,
        }}>
        <Text>Not a member? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={{textDecorationLine: 'underline', fontWeight: 'bold'}}>
            SIGN UP
          </Text>
        </TouchableOpacity>
      </Layout>
      <Text style={{textAlign: 'center', marginBottom: 20}}>Login with</Text>
      <Layout
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
      </Layout>
      <Text style={{textAlign: 'center', marginBottom: 20}}>or</Text>
      <Input
        style={styles.input}
        placeholder="Email"
        onChangeText={u => setUsername(u)}
        placeholderTextColor="#fff"
        accessoryLeft={() => (
          <Icon size={25} name="envelope" style={styles.icon} solid />
        )}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />

      <Input
        style={styles.input}
        placeholder="Password"
        secureTextEntry={secure}
        placeholderTextColor="#fff"
        onChangeText={p => setPass(p)}
        autoCorrect={false}
        accessoryLeft={() => (
          <Icon size={25} name="unlock" solid style={styles.icon} />
        )}
        accessoryRight={() => (
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Icon
              size={30}
              name={secure ? 'eye' : 'eye-slash'}
              solid
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
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
    </KeyboardAvoidingView>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  loggedIn: profile.loggedIn,
});

export default connect(mapStateToProps)(Login);
