import {Button, Layout, Spinner} from '@ui-kitten/components';
import React, {useState} from 'react';
import {Alert, ImageBackground, StyleSheet, TextInput} from 'react-native';
import DevicePixels from '../../helpers/DevicePixels';
import auth from '@react-native-firebase/auth';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';

const ForgotPassword: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'ForgotPassword'>;
}> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
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
      <TextInput
        style={{
          borderRadius: DevicePixels[5],
          margin: DevicePixels[10],
          marginVertical: DevicePixels[20],
          borderWidth: 0,
          backgroundColor: 'rgba(255,255,255,0.3)',
          paddingLeft: DevicePixels[10],
          height: DevicePixels[50],
          color: '#fff',
        }}
        placeholder="Email"
        onChangeText={e => setEmail(e)}
        placeholderTextColor="#fff"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />
      <Button
        onPress={async () => {
          setLoading(true);
          try {
            await auth().sendPasswordResetEmail(email);
            navigation.goBack();
            Alert.alert('Success', 'Please check your email');
          } catch (e) {
            Alert.alert('Error', e.message);
          }
          setLoading(false);
        }}
        accessoryLeft={() =>
          loading ? <Spinner style={{borderColor: '#fff'}} /> : null
        }
        style={{
          margin: DevicePixels[10],
          marginTop: DevicePixels[5],
          height: DevicePixels[50],
        }}
        disabled={!email || loading}>
        Send password reset email
      </Button>
    </ImageBackground>
  );
};

export default ForgotPassword;
