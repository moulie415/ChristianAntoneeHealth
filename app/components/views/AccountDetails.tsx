import {Button, Input, Layout, Text} from '@ui-kitten/components';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useState} from 'react';
import styles from '../../styles/views/SignUpFlow';
import {Keyboard, TouchableOpacity} from 'react-native';
import AccountDetailsProps from '../../types/views/AccountDetails';

const AccountDetails: React.FC<AccountDetailsProps> = ({
  setStep,
  dry,
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  email,
  setEmail,
  name,
  setName,
}) => {
  const disabled =
    (dry && (!password || !confirmPassword || password !== confirmPassword)) ||
    !email ||
    !name;
  const [secure, setSecure] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  return (
    <Layout style={{margin: 20}}>
      <Input
        style={styles.input}
        label="Name"
        value={name}
        onChangeText={setName}
      />
      <Input
        style={styles.input}
        label="Email"
        disabled={!dry}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        accessoryLeft={() => (
          <Icon style={styles.icon} size={25} name="envelope" solid />
        )}
      />
      {dry && (
        <Input
          style={styles.input}
          label="Password"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry={secure}
          blurOnSubmit={false}
          autoCorrect={false}
          accessoryLeft={() => (
            <Icon style={styles.icon} size={25} name="unlock" solid />
          )}
          accessoryRight={() => (
            <TouchableOpacity onPress={() => setSecure(!secure)}>
              <Icon
                style={styles.icon}
                size={30}
                name={secure ? 'eye' : 'eye-slash'}
                solid
              />
            </TouchableOpacity>
          )}
        />
      )}
      {dry && (
        <Input
          style={styles.input}
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          blurOnSubmit={false}
          autoCapitalize="none"
          secureTextEntry={secureConfirm}
          onSubmitEditing={() => Keyboard.dismiss()}
          autoCorrect={false}
          accessoryLeft={() => (
            <Icon style={styles.icon} size={25} name="unlock" solid />
          )}
          accessoryRight={() => (
            <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
              <Icon
                style={styles.icon}
                size={30}
                name={secureConfirm ? 'eye' : 'eye-slash'}
                solid
              />
            </TouchableOpacity>
          )}
        />
      )}
      {password !== confirmPassword && (
        <Text style={{marginTop: 10}} status="danger">
          Passwords do not match
        </Text>
      )}
      <Layout style={{flexDirection: 'row', marginVertical: 20}}>
        <Text>
          By signing up you agree to the terms and conditions in our{' '}
          <Text>Privacy Policy</Text>
        </Text>
      </Layout>
      <Button
        disabled={disabled}
        onPress={() => {
          setStep(1);
        }}>
        Continue
      </Button>
    </Layout>
  );
};

export default AccountDetails;
