import React, {useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {Spinner, Layout, Button, Text} from '@ui-kitten/components';
import auth from '@react-native-firebase/auth';
import styles from '../../styles/views/SignUp';
import SignUpProps from '../../types/views/SignUp';
import {handleAuth} from '../../actions/profile';
import DevicePixels from '../../helpers/DevicePixels';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const SignUp: React.FC<SignUpProps> = ({
  navigation,
  handleAuth: handleAuthAction,
}) => {
  const [secure, setSecure] = useState(true);
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [spinner, setSpinner] = useState(false);

  const signIn = async (email: string, password: string) => {
    try {
      return await auth().signInWithEmailAndPassword(email, password);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('../../images/sign-up.jpeg')}>
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
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'flex-end',
        }}>
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
            try {
              if (username && pass) {
                setSpinner(true);
                setSecure(true);
                const {user} = await signIn(username, pass);
                if (!user.emailVerified) {
                  Alert.alert(
                    'Sorry',
                    'You must first verify your email using the link we sent you before logging in, please also check your spam folder',
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
            } catch (e) {
              console.log(e);
              setSpinner(false);
            }
          }}
          accessoryLeft={() =>
            spinner ? <Spinner style={{backgroundColor: '#fff'}} /> : null
          }
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
          <Text style={{color: '#fff'}}>Not signed up? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
        <TouchableOpacity
          style={{marginBottom: DevicePixels[20], alignSelf: 'center'}}
          onPress={() => navigation.navigate('ForgotPassword')}>
          <Text
            style={{
              fontWeight: 'bold',
              color: '#fff',
              textDecorationLine: 'underline',
            }}>
            Forgot password?
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

const mapDispatchToProps = {
  handleAuth,
};

export default connect(null, mapDispatchToProps)(SignUp);
