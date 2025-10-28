import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../../constants/colors';

import Header from '../../commons/Header';
import Text from '../../commons/Text';

const Policies = () => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.appGrey }}>
      <SafeAreaView>
        <Header hasBack title="Policies and Terms" />
        <TouchableOpacity
          onPress={() => Linking.openURL(process.env.EXPO_PUBLIC_PRIVACY_POLICY as string)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 20,
          }}
        >
          <FontAwesome6
            style={{ marginLeft: 20 }}
            name="file"
            color={colors.appWhite}
            size={30}
          />
          <Text
            style={{
              color: colors.appWhite,
              fontWeight: 'bold',
              marginLeft: 10,
              textDecorationLine: 'underline',
            }}
          >
            Privacy Policy
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default Policies;
