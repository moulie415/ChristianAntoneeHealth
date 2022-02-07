import {Input, Layout, Text} from '@ui-kitten/components';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useState} from 'react';
import styles from '../../../styles/views/SignUpFlow';
import {Keyboard, TouchableOpacity, View} from 'react-native';
import AccountDetailsProps from '../../../types/views/AccountDetails';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';

const AccountDetails: React.FC<AccountDetailsProps> = ({
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
  const [secure, setSecure] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  return (
    <View style={{marginTop: DevicePixels[20]}}>
      <Text
        category="h5"
        style={{
          color: colors.appWhite,
          textAlign: 'center',
          marginBottom: DevicePixels[10],
        }}>
        What's your name?
      </Text>
      <Input style={styles.input} value={name} onChangeText={setName} />
      {dry && (
        <>
          <Text
            category="label"
            style={{
              marginTop: DevicePixels[10],
              marginBottom: DevicePixels[5],
              color: colors.appWhite,
            }}>
            What's your email
          </Text>
          <Input
            style={styles.input}
            disabled={!dry}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            accessoryLeft={() => (
              <Icon
                style={styles.icon}
                size={DevicePixels[25]}
                name="envelope"
                solid
              />
            )}
          />
        </>
      )}
      {dry && (
        <>
          <Text
            category="label"
            style={{
              marginTop: DevicePixels[10],
              marginBottom: DevicePixels[5],
              color: colors.appWhite,
            }}>
            Enter password
          </Text>
          <Input
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry={secure}
            autoCorrect={false}
            accessoryLeft={() => (
              <Icon
                style={styles.icon}
                size={DevicePixels[25]}
                name="unlock"
                solid
              />
            )}
            accessoryRight={() => (
              <TouchableOpacity onPress={() => setSecure(!secure)}>
                <Icon
                  style={styles.icon}
                  size={DevicePixels[30]}
                  name={secure ? 'eye' : 'eye-slash'}
                  solid
                />
              </TouchableOpacity>
            )}
          />
        </>
      )}
      {dry && (
        <>
          <Text
            category="label"
            style={{
              marginTop: DevicePixels[10],
              marginBottom: DevicePixels[5],
              color: colors.appWhite,
            }}>
            Confirm Password
          </Text>
          <Input
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
            secureTextEntry={secureConfirm}
            onSubmitEditing={() => Keyboard.dismiss()}
            autoCorrect={false}
            accessoryLeft={() => (
              <Icon
                style={styles.icon}
                size={DevicePixels[25]}
                name="unlock"
                solid
              />
            )}
            accessoryRight={() => (
              <TouchableOpacity
                onPress={() => setSecureConfirm(!secureConfirm)}>
                <Icon
                  style={styles.icon}
                  size={DevicePixels[30]}
                  name={secureConfirm ? 'eye' : 'eye-slash'}
                  solid
                />
              </TouchableOpacity>
            )}
          />
        </>
      )}
      {password !== confirmPassword && (
        <Text
          style={{marginTop: DevicePixels[10], fontWeight: 'bold'}}
          status="danger">
          Passwords do not match
        </Text>
      )}
    </View>
  );
};

export default AccountDetails;
