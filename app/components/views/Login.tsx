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

interface CarouselItem {
  title: string;
  description: string;
  image: ImageSourcePropType;
}

const items: CarouselItem[] = [
  {
    title: 'Targeted Workouts',
    description:
      'Select from a variety of exercise routines designed to target specific body parts',
    image: require('../../images/login.jpeg'),
  },

  {
    title: 'Track Progress',
    description: `Monitor your activity and track your fitness in app as well as with ${
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
    title: 'Stay Connected',
    description:
      'Enjoy in-app messaging where you can share exercises, workouts and compare test results',
    image: require('../../images/Homepage_activity_tracking.jpeg'),
  },
];

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
                  left: 0,
                  right: 0,
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
