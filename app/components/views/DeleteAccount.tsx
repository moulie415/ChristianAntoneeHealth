import React, {useEffect, useState} from 'react';
import {Alert, ImageBackground, StyleSheet, View} from 'react-native';
import DevicePixels from '../../helpers/DevicePixels';
import auth from '@react-native-firebase/auth';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import Profile from '../../types/Profile';
import {appleSignIn, facebookSignIn, googleSignIn} from '../../helpers/api';
import {setLoggedIn} from '../../actions/profile';
import Text from '../commons/Text';
import Button from '../commons/Button';
import Input from '../commons/Input';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../commons/Header';

const DeleteAccount: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'DeleteAccount'>;
  profile: Profile;
  setLoggedIn: (loggedIn: boolean) => void;
}> = ({profile, setLoggedIn: setLoggedInAction}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [requiresPassword, setRequiresPassword] = useState(false);
  useEffect(() => {
    const user = auth().currentUser;
    if (user?.providerData?.find(data => data.providerId === 'password')) {
      setRequiresPassword(true);
    }
  }, []);
  return (
    <ImageBackground
      source={require('../../images/login.jpeg')}
      blurRadius={5}
      style={{flex: 1}}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: '#000',
          opacity: 0.7,
        }}
      />
      <SafeAreaView>
        <Header hasBack title="Delete account" />
        <Text
          style={{
            color: '#fff',
            margin: DevicePixels[10],
            fontWeight: 'bold',
            lineHeight: DevicePixels[20],
          }}>
          {`We're sad to see you go, please enter your email${
            requiresPassword ? ' and password' : ''
          } to confirm deletion and be aware that this will delete all your CA Health data and it will not be recoverable.`}
        </Text>
        <Input
          style={{
            margin: DevicePixels[10],
          }}
          placeholder="Email"
          onChangeText={e => setEmail(e)}
          placeholderTextColor="#fff"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />
        {requiresPassword && (
          <Input
            style={{margin: DevicePixels[10]}}
            placeholder="Password"
            onChangeText={p => setPassword(p)}
            placeholderTextColor="#fff"
            autoCapitalize="none"
            autoCorrect={false}
            secure
          />
        )}
        <Button
          text="Confirm account deletion"
          onPress={async () => {
            setLoading(true);
            try {
              const user = auth().currentUser;
              if (requiresPassword) {
                await auth().signInWithEmailAndPassword(email, password);
              }
              if (
                user?.providerData?.find(
                  data => data.providerId === 'google.com',
                )
              ) {
                await googleSignIn();
              }
              if (
                user?.providerData?.find(
                  data => data.providerId === 'facebook.com',
                )
              ) {
                await facebookSignIn();
              }
              if (
                user?.providerData?.find(
                  data => data.providerId === 'apple.com',
                )
              ) {
                await appleSignIn();
              }
              await user.delete();
              setLoggedInAction(false);
              Alert.alert('Success', 'Your account has been deleted');
            } catch (e) {
              Alert.alert('Error', e.message);
            }
            setLoading(false);
          }}
          loading={loading}
          style={{
            margin: DevicePixels[10],
            marginTop: DevicePixels[5],
          }}
          disabled={
            email !== profile.email ||
            (requiresPassword && !password) ||
            loading
          }
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

const mapDispatchToProps = {
  setLoggedIn,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccount);
