import {Button, Input, Layout, Text} from '@ui-kitten/components';
import React from 'react';
import {View} from 'react-native';
import {getProfileImage} from '../../helpers/images';
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
  const disabled = (dry && (!password || !confirmPassword)) || !email || !name;
  return (
    <Layout style={{margin: 20}}>
      <Input label="Name" value={name} onChangeText={setName} />
      <Input
        label="Email"
        disabled={!dry}
        value={email}
        onChangeText={setEmail}
      />
      {dry && (
        <Input label="Password" value={password} onChangeText={setPassword} />
      )}
      {dry && (
        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
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
