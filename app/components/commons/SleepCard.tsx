import {View} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {navigationRef} from '../../RootNavigation';
import {PlanSleep} from '../../types/Shared';
import Text from './Text';
import colors from '../../constants/colors';

const SleepCard: React.FC<{sleep: PlanSleep}> = ({sleep}) => {
  return (
    <TouchableOpacity onPress={() => navigationRef.navigate('Sleep', {sleep})}>
      <FastImage
        style={{
          height: 120,
          marginHorizontal: 10,
          marginBottom: 10,
          borderRadius: 10,
        }}
        source={require('../../images/sleep.jpg')}>
        <View
          style={{
            height: 120,
            justifyContent: 'center',
            padding: 10,
            borderRadius: 10,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <Text
            style={{
              color: colors.appWhite,
              fontSize: 16,
              fontWeight: 'bold',
              marginBottom: 5,
            }}>
            Sleep
          </Text>
          <Text
            style={{
              color: colors.appWhite,
              fontSize: 14,
            }}>
            View your personalised sleep advice
          </Text>
        </View>
      </FastImage>
    </TouchableOpacity>
  );
};

export default SleepCard;
