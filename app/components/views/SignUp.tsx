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

import colors from '../../constants/colors';
import Text from '../commons/Text';
import Input from '../commons/Input';
import Button from '../commons/Button';
import {createUser} from '../../helpers/api';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Header from '../commons/Header';
import FastImage from 'react-native-fast-image';

const SignUp: React.FC<SignUpProps> = ({
  navigation,
  handleAuth: handleAuthAction,
}) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
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
      const user = await createUser(email, pass, {name, surname});
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
    <FastImage
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
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
          <Header title="Registration" hasBack />
          <Text
            style={{
              color: colors.appWhite,
              margin: 20,
              marginTop: 0,
            }}>
            Please enter your personal details, then we will send you a
            verification email (please remember to check your junk/spam folder).
          </Text>
          <Input
            containerStyle={{
              marginHorizontal: 20,
            }}
            placeholder="First Name"
            onChangeText={setName}
            value={name}
            placeholderTextColor="#fff"
            autoCorrect={false}
          />
          <Input
            containerStyle={{
              marginHorizontal: 20,
              marginTop: 20,
            }}
            placeholder="Last Name"
            onChangeText={setSurname}
            value={surname}
            placeholderTextColor="#fff"
            autoCorrect={false}
          />
          <Input
            containerStyle={{
              marginHorizontal: 20,
              marginTop: 20,
            }}
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            placeholderTextColor="#fff"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
          <Input
            containerStyle={{
              marginHorizontal: 20,
              marginTop: 20,
            }}
            placeholder="Password"
            secure
            placeholderTextColor="#fff"
            onChangeText={setPass}
            value={pass}
            autoCorrect={false}
            autoCapitalize="none"
          />
          <Input
            containerStyle={{
              marginHorizontal: 20,
              marginTop: 20,
            }}
            placeholder="Confirm password"
            secure
            placeholderTextColor="#fff"
            onChangeText={setConfirm}
            value={confirm}
            autoCorrect={false}
            autoCapitalize="none"
          />
          <Button
            loading={loading}
            disabled={
              loading || !pass || !name || !surname || !email || !confirm
            }
            onPress={signUp}
            text="Sign Up"
            style={{
              marginHorizontal: 20,
              marginTop: 20,
            }}
          />

          <TouchableOpacity
            style={{marginTop: 10}}
            onPress={() => navigation.navigate('Login')}
            hitSlop={{
              top: 10,
              bottom: 10,
              right: 10,
              left: 10,
            }}>
            <Text
              style={{
                color: '#fff',
                marginHorizontal: 20,
                textAlign: 'center',
              }}>
              Already have an account or want to use {getAuthString()}
              {'  '}
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                }}>
                Log in
              </Text>
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </FastImage>
  );
};

const mapDispatchToProps = {
  handleAuth,
};

export default connect(null, mapDispatchToProps)(SignUp);
