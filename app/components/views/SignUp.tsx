import React, {useState} from 'react';
import {
  Alert,
  ImageBackground,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import SignUpProps from '../../types/views/SignUp';
import {handleAuth} from '../../actions/profile';
import DevicePixels from '../../helpers/DevicePixels';
import colors from '../../constants/colors';
import Text from '../commons/Text';
import Input from '../commons/Input';
import Button from '../commons/Button';
import {createUser} from '../../helpers/api';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const SignUp: React.FC<SignUpProps> = ({
  navigation,
  handleAuth: handleAuthAction,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    try {
      if (pass !== confirm) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      setLoading(true);
      const user = await createUser(email, pass, {name});
      handleAuthAction(user);
    } catch (e) {
      setLoading(false);
      Alert.alert('Error', e.message);
    }
  };

  const getAuthString = () => {
    if (Platform.OS === 'ios') {
      return 'Google, Facebook or Apple login?';
    }
    return 'Google or Facebook login?';
  };

  return (
    <ImageBackground
      style={{flex: 1}}
      blurRadius={2}
      source={require('../../images/sign-up.jpeg')}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.appBlack,
          opacity: 0.7,
        }}
      />
      <SafeAreaView>
        <KeyboardAwareScrollView>
          <Text
            variant="bold"
            style={{
              color: colors.appWhite,
              fontSize: DevicePixels[24],
              margin: DevicePixels[20],
              marginBottom: 0,
            }}>
            Registration
          </Text>
          <Text
            style={{
              color: colors.appWhite,
              margin: DevicePixels[20],
              marginTop: DevicePixels[10],
            }}>
            Please enter your personal details, then we will send you a
            verification email (please remember to check your junk/spam folder).
          </Text>
          <Input
            containerStyle={{
              marginHorizontal: DevicePixels[20],
            }}
            placeholder="Name"
            onChangeText={setName}
            placeholderTextColor="#fff"
            autoCorrect={false}
          />
          <Input
            containerStyle={{
              marginHorizontal: DevicePixels[20],
              marginTop: DevicePixels[20],
            }}
            placeholder="Email"
            onChangeText={setEmail}
            placeholderTextColor="#fff"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
          <Input
            containerStyle={{
              marginHorizontal: DevicePixels[20],
              marginTop: DevicePixels[20],
            }}
            placeholder="Password"
            secure
            placeholderTextColor="#fff"
            onChangeText={setPass}
            autoCorrect={false}
            autoCapitalize="none"
          />
          <Input
            containerStyle={{
              marginHorizontal: DevicePixels[20],
              marginTop: DevicePixels[20],
            }}
            placeholder="Confirm password"
            secure
            placeholderTextColor="#fff"
            onChangeText={setConfirm}
            autoCorrect={false}
            autoCapitalize="none"
          />
          <Button
            loading={loading}
            disabled={loading}
            onPress={signUp}
            text="Signup"
            style={{
              marginHorizontal: DevicePixels[20],
              marginTop: DevicePixels[20],
            }}
          />

          <TouchableOpacity
            style={{marginTop: DevicePixels[10]}}
            onPress={() => navigation.navigate('Login')}
            hitSlop={{
              top: DevicePixels[10],
              bottom: DevicePixels[10],
              right: DevicePixels[10],
              left: DevicePixels[10],
            }}>
            <Text
              style={{
                color: '#fff',
                marginHorizontal: DevicePixels[20],
                textAlign: 'center',
              }}>
              Already have an account or want to use {getAuthString()}
              {'  '}
              <Text
                variant="bold"
                style={{
                  color: '#fff',
                }}>
                Log in
              </Text>
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const mapDispatchToProps = {
  handleAuth,
};

export default connect(null, mapDispatchToProps)(SignUp);
