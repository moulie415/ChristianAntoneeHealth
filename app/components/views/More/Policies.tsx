import React from 'react';
import {Linking, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../../constants/colors';
import DevicePixels from '../../../helpers/DevicePixels';
import Text from '../../commons/Text';

const Policies = () => {
  return (
    <View style={{flex: 1}}>
      <Text style={{textAlign: 'center', marginTop: DevicePixels[20]}}>
        Policies and Terms
      </Text>
      <TouchableOpacity
        onPress={() =>
          Linking.openURL('https://christianantonee.com/privacy-policy')
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
        
          style={{color: colors.appBlue, marginLeft: DevicePixels[10]}}>
          Privacy Policy
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Policies;
