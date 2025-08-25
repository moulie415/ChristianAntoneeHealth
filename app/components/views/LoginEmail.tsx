import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { RootState, StackParamList } from '../../App';
import colors from '../../constants/colors';
import { signIn } from '../../helpers/api';
import { handleAuth, setLoginEmail } from '../../reducers/profile';
import Button from '../commons/Button';
import Header from '../commons/Header';
import Input from '../commons/Input';
import Text from '../commons/Text';

const LoginEmail: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'SignUp'>;
  handleAuth: (user: FirebaseAuthTypes.User) => void;
  email: string;
  setEmail: (email: string) => void;
}> = ({ navigation, handleAuth: handleAuthAction, email, setEmail }) => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  const signInEmail = async () => {
    try {
      setLoading(true);
      await signIn(email, password, handleAuthAction);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.appGrey, flex: 1 }}>
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="always"
      >
        <Header title="Login" hasBack />
        <Input
          onChangeText={setEmail}
          value={email}
          containerStyle={{
            marginHorizontal: 20,
            marginTop: 10,
          }}
          placeholder="Email"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          placeholderTextColor={colors.appWhite}
          icon="envelope"
        />
        <Input
          onChangeText={setPassword}
          value={password}
          containerStyle={{
            marginHorizontal: 20,
            marginTop: 20,
          }}
          placeholder="Password"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={colors.appWhite}
          secure
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          hitSlop={{
            top: 10,
            bottom: 10,
            right: 10,
            left: 10,
          }}
          style={{
            alignSelf: 'flex-end',
            marginRight: 20,
            marginTop: 10,
          }}
        >
          <Text style={{ color: colors.appWhite }}>Forgot password?</Text>
        </TouchableOpacity>

        <Button
          disabled={loading}
          loading={loading}
          text="Log in"
          style={{
            marginHorizontal: 20,
            marginTop: 20,
          }}
          onPress={signInEmail}
        />

        <TouchableOpacity
          style={{ marginVertical: 20, alignSelf: 'center' }}
          onPress={() => {
            navigation.navigate('SignUp');
          }}
        >
          <Text style={{ color: 'rgba(255, 255, 255, 0.56)' }}>
            {"Don't have an account? "}
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
              }}
            >
              Sign up
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginEmail);
