import React, {useState} from 'react';
import {Alert, SafeAreaView} from 'react-native';

import auth from '@react-native-firebase/auth';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import colors from '../../constants/colors';
import Button from '../commons/Button';
import Header from '../commons/Header';
import Input from '../commons/Input';

const ForgotPassword: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'ForgotPassword'>;
}> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <SafeAreaView style={{backgroundColor: colors.appGrey, flex: 1}}>
      <Header hasBack title="Forgot password" />
      <Input
        style={{
          margin: 20,
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
            // @ts-ignore
            Alert.alert('Error', e.message);
          }
          setLoading(false);
        }}
        loading={loading}
        style={{
          marginHorizontal: 20,
        }}
        text="Send password reset email"
        disabled={!email || loading}
      />
    </SafeAreaView>
  );
};

export default ForgotPassword;
