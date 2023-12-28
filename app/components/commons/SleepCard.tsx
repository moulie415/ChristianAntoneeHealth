import {View} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {navigationRef} from '../../RootNavigation';
import {PlanSleep} from '../../types/Shared';
import Text from './Text';
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome6';
import LinearGradient from 'react-native-linear-gradient';

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
        <LinearGradient
          colors={[
            'rgba(54, 57, 68,0)',
            'rgba(54, 57, 68,0.8)',
            'rgb(54, 57, 68)',
          ]}
          style={{
            height: 100,
            justifyContent: 'flex-end',
            padding: 10,
            borderRadius: 10,
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
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
        </LinearGradient>
      </FastImage>
    </TouchableOpacity>
  );
};

export default SleepCard;
