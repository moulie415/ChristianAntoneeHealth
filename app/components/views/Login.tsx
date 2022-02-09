import React, {useState} from 'react';
import {
  Alert,
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
import auth from '@react-native-firebase/auth';
import {Layout} from '@ui-kitten/components';
import {connect} from 'react-redux';
import styles from '../../styles/views/Login';
import LoginProps from '../../types/views/Login';
import {MyRootState} from '../../types/Shared';
import appleAuth from '@invertase/react-native-apple-authentication';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {GoogleSignin} from '@react-native-community/google-signin';
import DevicePixels from '../../helpers/DevicePixels';
import {signUp} from '../../actions/profile';
import colors from '../../constants/colors';
import Text from '../commons/Text';

GoogleSignin.configure({
  webClientId:
    '48631950986-ibg0u91q5m6hsllkunhe9frf00id7r8c.apps.googleusercontent.com', // From Firebase Console Settings
});

interface CarouselItem {
  title: string;
  description: string;
  image: ImageSourcePropType;
}

const items: CarouselItem[] = [
  {
    title: 'Targeted Workouts',
    description:
      'Create custom workouts to target specific areas of the body and types of fitness.',
    image: require('../../images/login.jpeg'),
  },
  {
    title: 'Track Progress',
    description: `Monitor your activity and track your fitness with your with ${
      Platform.OS === 'ios' ? 'Apple Health' : 'Google Fit'
    }`,
    image: require('../../images/2nd_carousel_image_fitness_tracking.jpeg'),
  },
  {
    title: 'Test Fitness',
    description:
      'Measure fitness across 4 key areas, and get recommendations to improve',
    image: require('../../images/3rd_carousel_image_fitness_testing.jpeg'),
  },
  {
    title: 'Quick routines',
    description:
      'Select from a variety of exercise routines designed to target specific body parts',
    image: require('../../images/1st_Carousel_image_targeted_workouts.jpeg'),
  },
];

const Login: React.FC<LoginProps> = ({navigation}) => {
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
    <>
      <Swiper
        activeDotColor={colors.appBlue}
        removeClippedSubviews={false}
        autoplay>
        {items.map(({title, image, description}) => {
          return (
            <ImageBackground key={title} source={image} style={{flex: 1}}>
              <Layout
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: '#000',
                  opacity: 0.7,
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: DevicePixels[220],
                  margin: DevicePixels[20],
                }}>
                <Text
                  style={{
                    color: colors.appWhite,
                    textAlign: 'center',
                    marginBottom: DevicePixels[10],
                  }}
                  category="h6">
                  {title}
                </Text>
                <Text style={{color: colors.appWhite, textAlign: 'center'}}>
                  {description}
                </Text>
              </View>
            </ImageBackground>
          );
        })}
      </Swiper>

      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('../../images/logo-and-text.png')}
        />
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
    </>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  loggedIn: profile.loggedIn,
});

const mapDispatchToProps = {
  signUp,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
