import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { RootState, StackParamList } from '../../App';
import colors from '../../constants/colors';
import { createUser } from '../../helpers/api';
import { handleAuth, setLoginEmail } from '../../reducers/profile';
import Button from '../commons/Button';
import Header from '../commons/Header';
import Input from '../commons/Input';
import Text from '../commons/Text';

const SignUp: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'SignUp'>;
  handleAuth: (user: FirebaseAuthTypes.User) => void;
  email: string;
  setEmail: (email: string) => void;
}> = ({ navigation, handleAuth: handleAuthAction, email, setEmail }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    setEmail('');
  }, [setEmail, setPassword]);

  const signUp = async () => {
    try {
      if (password !== confirm) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      setLoading(true);
      const user = await createUser(email, password, { name, surname });
      handleAuthAction(user);
    } catch (e) {
      setLoading(false);
      if (e instanceof Error) {
        Alert.alert('Error', e.message);
      }
    }
  };

  const getAuthString = () => {
    if (Platform.OS === 'ios') {
      return 'Google, Facebook or Apple login?';
    }
    return 'Google or Facebook login?';
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.appGrey, flex: 1 }}>
      <KeyboardAwareScrollView
        
        keyboardShouldPersistTaps="always"
      >
        <Header title="Registration" hasBack />
        <Text
          style={{
            color: colors.appWhite,
            margin: 20,
            marginTop: 0,
          }}
        >
          Please enter your personal details, then we will send you a
          verification email (please remember to check your junk/spam folder).
        </Text>
        <Input
          containerStyle={{
            marginHorizontal: 20,
          }}
          placeholder="First Name"
          onChangeText={setName}
          icon="user"
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
          icon="user"
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
          icon="envelope"
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
          onChangeText={setPassword}
          value={password}
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
            loading || !password || !name || !surname || !email || !confirm
          }
          onPress={signUp}
          text="Sign Up"
          style={{
            marginHorizontal: 20,
            marginTop: 20,
          }}
        />

        <TouchableOpacity
          style={{ marginTop: 10 }}
          onPress={() => navigation.navigate('Login')}
          hitSlop={{
            top: 10,
            bottom: 10,
            right: 10,
            left: 10,
          }}
        >
          <Text
            style={{
              color: '#fff',
              marginHorizontal: 20,
              textAlign: 'center',
            }}
          >
            Already have an account or want to use {getAuthString()}
            {'  '}
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
              }}
            >
              Log in
            </Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const mapStateToProps = ({ profile }: RootState) => ({
  email: profile.loginEmail,
});

const mapDispatchToProps = {
  handleAuth,
  setEmail: setLoginEmail,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
