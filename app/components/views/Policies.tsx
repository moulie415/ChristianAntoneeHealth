import {Layout, Text} from '@ui-kitten/components';
import React from 'react';
import {Linking, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';

const Policies = () => {
  return (
    <Layout style={{flex: 1}}>
      <Text category="h5" style={{textAlign: 'center', marginTop: 20}}>
        Policies and Terms
      </Text>
      <TouchableOpacity
        onPress={() =>
          Linking.openURL('https://healthandmovement.co.uk/privacy-policy')
        }
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 20,
        }}>
        <Icon
          style={{marginLeft: 20}}
          name="file"
          color={colors.appBlue}
          size={30}
        />
        <Text category="s1" style={{color: colors.appBlue, marginLeft: 10}}>
          Privacy Policy
        </Text>
      </TouchableOpacity>
    </Layout>
  );
};

export default Policies;
