import React, {useState} from 'react';
import {
  Alert,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import DevicePixels from '../../helpers/DevicePixels';
import auth from '@react-native-firebase/auth';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import Button from '../commons/Button';
import Input from '../commons/Input';
import colors from '../../constants/colors';
import Header from '../commons/Header';
import FastImage from 'react-native-fast-image';

const ForgotPassword: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'ForgotPassword'>;
}> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <FastImage
      source={require('../../images/login.jpeg')}
      blurRadius={5}
      style={{flex: 1}}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.appBlack,
          opacity: 0.5,
        }}
      />
      <SafeAreaView>
        <Header hasBack title="Forgot password" />
        <Input
          style={{
            margin: DevicePixels[20],
            marginTop: 0,
          }}
          placeholder="Email"
          value={email}
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
          loading={loading}
          style={{
            marginHorizontal: DevicePixels[20],
          }}
          text="Send password reset email"
          disabled={!email || loading}
        />
      </SafeAreaView>
    </FastImage>
  );
};

export default ForgotPassword;
