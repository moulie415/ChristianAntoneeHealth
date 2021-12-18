import {Button, Layout, Spinner, Text} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {Alert, ImageBackground, StyleSheet, TextInput} from 'react-native';
import DevicePixels from '../../helpers/DevicePixels';
import auth from '@react-native-firebase/auth';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import Profile from '../../types/Profile';

const DeleteAccount: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'DeleteAccount'>;
  profile: Profile;
}> = ({profile}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [requiresPassword, setRequiresPassword] = useState(false);
  useEffect(() => {
    const user = auth().currentUser;
    console.log(user.providerData);
    if (user?.providerData?.find(data => data.providerId === 'password')) {
      setRequiresPassword(true);
    }
  }, []);
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
      <Text
        style={{
          color: '#fff',
          margin: DevicePixels[10],
          fontWeight: 'bold',
          lineHeight: DevicePixels[20],
        }}>
        {`We're sad to see you go, please enter your email${
          requiresPassword ? ' and password' : ''
        } to confirm deletion and be aware that this will delete all your Health and Movement data and it will not be recoverable.`}
      </Text>
      <TextInput
        style={{
          borderRadius: DevicePixels[5],
          margin: DevicePixels[10],
          marginBottom: DevicePixels[10],
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
      <TextInput
        style={{
          borderRadius: DevicePixels[5],
          margin: DevicePixels[10],
          marginBottom: DevicePixels[20],
          borderWidth: 0,
          backgroundColor: 'rgba(255,255,255,0.3)',
          paddingLeft: DevicePixels[10],
          height: DevicePixels[50],
          color: '#fff',
        }}
        placeholder="Password"
        onChangeText={p => setPassword(p)}
        placeholderTextColor="#fff"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
      />
      <Button
        onPress={async () => {
          setLoading(true);
          try {
            if (requiresPassword) {
              await auth().signInWithEmailAndPassword(email, password);
            }
            const user = auth().currentUser;
            await user.delete();
            Alert.alert('Success', 'Your account has been deleted');
          } catch (e) {
            Alert.alert('Error', e.message);
          }
          setLoading(false);
        }}
        accessoryLeft={() =>
          loading ? <Spinner style={{backgroundColor: '#fff'}} /> : null
        }
        style={{
          margin: DevicePixels[10],
          marginTop: DevicePixels[5],
          height: DevicePixels[50],
        }}
        disabled={
          email !== profile.email || (requiresPassword && !password) || loading
        }>
        Confirm account deletion
      </Button>
    </ImageBackground>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(DeleteAccount);
