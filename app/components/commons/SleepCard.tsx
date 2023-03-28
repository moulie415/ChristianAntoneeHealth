import {View} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {navigationRef} from '../../RootNavigation';
import {PlanSleep} from '../../types/Shared';
import Text from './Text';
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';

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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="bed"
              color={colors.appWhite}
              size={20}
              style={{marginHorizontal: 10}}
            />
            <View>
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: 25,
                  fontWeight: 'bold',
                }}>
                Sleep
              </Text>
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: 16,
                  marginTop: 5,
                  fontWeight: 'bold',
                  width: 280,
                }}>
                Your personalised sleep advice
              </Text>
            </View>
          </View>
        </View>
      </FastImage>
    </TouchableOpacity>
  );
};

export default SleepCard;
