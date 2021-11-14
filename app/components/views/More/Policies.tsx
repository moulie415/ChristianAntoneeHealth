import {Layout, Text} from '@ui-kitten/components';
import React from 'react';
import {Linking, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../../constants/colors';
import DevicePixels from '../../../helpers/DevicePixels';

const Policies = () => {
  return (
    <Layout style={{flex: 1}}>
      <Text
        category="h5"
        style={{textAlign: 'center', marginTop: DevicePixels[20]}}>
        Policies and Terms
      </Text>
      <TouchableOpacity
        onPress={() =>
          Linking.openURL('https://healthandmovement.co.uk/privacy-policy')
        }
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: DevicePixels[20],
        }}>
        <Icon
          style={{marginLeft: DevicePixels[20]}}
          name="file"
          color={colors.appBlue}
          size={DevicePixels[30]}
        />
        <Text
          category="s1"
          style={{color: colors.appBlue, marginLeft: DevicePixels[10]}}>
          Privacy Policy
        </Text>
      </TouchableOpacity>
    </Layout>
  );
};

export default Policies;
