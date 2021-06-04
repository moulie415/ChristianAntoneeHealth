import {Button, Input, Layout, Text} from '@ui-kitten/components';
import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import {getProfileImage} from '../../helpers/images';
import AccountDetailsProps from '../../types/views/AccountDetails';

const AccountDetails: FunctionComponent<AccountDetailsProps> = ({
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
    <View style={{margin: 20}}>
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
      <View style={{flexDirection: 'row', marginVertical: 20}}>
        <Text>
          By signing up you agree to the terms and conditions in our{' '}
          <Text>Privacy Policy</Text>
        </Text>
      </View>
      <Button
        disabled={disabled}
        onPress={() => {
          setStep(1);
        }}>
        Continue
      </Button>
    </View>
  );
};

export default AccountDetails;
