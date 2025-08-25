import React, { useState } from 'react';
import { Alert, View } from 'react-native';

import auth from '@react-native-firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';
import { StackParamList } from '../../App';
import colors from '../../constants/colors';
import { useAppSelector } from '../../hooks/redux';
import Button from '../commons/Button';
import Header from '../commons/Header';
import Input from '../commons/Input';

const ChangePassword: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'ChangePassword'>;
}> = ({ navigation }) => {
  const [current, setCurrent] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { email } = useAppSelector(state => state.profile.profile);

  return (
    <SafeAreaView style={{ backgroundColor: colors.appGrey, flex: 1 }}>
      <Header hasBack title="Change password" />
      <View style={{ marginHorizontal: 20 }}>
        <Input
          style={{
            marginBottom: 20,
          }}
          placeholder="Current password"
          value={current}
          onChangeText={e => setCurrent(e)}
          placeholderTextColor="#fff"
          autoCapitalize="none"
          autoCorrect={false}
          secure
        />
        <Input
          style={{
            marginBottom: 20,
          }}
          placeholder="New password"
          value={newPassword}
          onChangeText={e => setNewPassword(e)}
          placeholderTextColor="#fff"
          autoCapitalize="none"
          autoCorrect={false}
          secure
        />
        <Input
          style={{
            marginBottom: 20,
          }}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={e => setConfirmPassword(e)}
          placeholderTextColor="#fff"
          autoCapitalize="none"
          autoCorrect={false}
          secure
        />
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Button
          onPress={async () => {
            setLoading(true);
            try {
              await auth().signInWithEmailAndPassword(email, current);
              await auth().currentUser?.updatePassword(confirmPassword);
              navigation.goBack();
              Snackbar.show({ text: 'Password changed successfully' });
            } catch (e) {
              if (e instanceof Error) {
                Alert.alert('Error', e.message);
              }
            }
            setLoading(false);
          }}
          loading={loading}
          style={{
            marginHorizontal: 20,
          }}
          text="Confirm"
          disabled={!newPassword || newPassword !== confirmPassword || loading}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;
