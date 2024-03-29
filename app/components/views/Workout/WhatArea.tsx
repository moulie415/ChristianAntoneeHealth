import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackParamList} from '../../../App';
import colors from '../../../constants/colors';

import Header from '../../commons/Header';
import Text from '../../commons/Text';
import LinearGradient from 'react-native-linear-gradient';
import {FONTS_SIZES} from '../../../constants';

const TILE_HEIGHT = Dimensions.get('window').height / 5;

const WhatArea: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'WhatArea'>;
  route: RouteProp<StackParamList, 'WhatArea'>;
}> = ({navigation, route}) => {
  const {equipment} = route.params;
  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView style={{flex: 1}}>
        <Header hasBack />

        <Text
          style={{
            color: colors.appWhite,
            margin: 20,
            marginTop: 0,
            fontSize: 22,
            fontWeight: 'bold',
          }}>
          What area do you want to focus on?
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('WorkoutList', {equipment, area: 'upper'})
          }
          style={{
            margin: 20,
            marginTop: 5,
            borderRadius: 5,
            width: Dimensions.get('window').width - 40,
          }}>
          <FastImage
            style={{
              height: TILE_HEIGHT,
              justifyContent: 'flex-end',
              borderRadius: 10,
            }}
            source={require('../../../images/upper_body.jpeg')}>
            <LinearGradient
              colors={[
                'rgba(54, 57, 68,0)',
                'rgba(54, 57, 68,0.8)',
                'rgb(54, 57, 68)',
              ]}
              style={{
                height: 75,
                justifyContent: 'flex-end',
                borderRadius: 10,
                padding: 10,
                marginBottom: -1,
              }}>
              <Text
                style={{
                  color: colors.appWhite,
                  fontWeight: 'bold',
                  fontSize: FONTS_SIZES.MEDIUM_LARGE,
                  marginBottom: 5,
                }}>
                Upper Body
              </Text>
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: 12,
                }}>
                (Workouts for your chest, back, arms, shoulders and abs)
              </Text>
            </LinearGradient>
          </FastImage>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('WorkoutList', {equipment, area: 'lower'})
          }
          style={{
            margin: 20,
            marginTop: 5,
            borderRadius: 5,
            width: Dimensions.get('window').width - 40,
          }}>
          <FastImage
            style={{
              height: TILE_HEIGHT,
              justifyContent: 'flex-end',
              borderRadius: 10,
            }}
            source={require('../../../images/lower_body.jpeg')}>
            <LinearGradient
              colors={[
                'rgba(54, 57, 68,0)',
                'rgba(54, 57, 68,0.8)',
                'rgb(54, 57, 68)',
              ]}
              style={{
                height: 75,
                justifyContent: 'flex-end',
                borderRadius: 10,
                padding: 10,
                marginBottom: -1,
              }}>
              <Text
                style={{
                  color: colors.appWhite,
                  fontWeight: 'bold',
                  fontSize: FONTS_SIZES.MEDIUM_LARGE,
                  marginBottom: 5,
                }}>
                Lower Body
              </Text>
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: 12,
                }}>
                (Train your glutes, quads, hamstrings and inner thigh)
              </Text>
            </LinearGradient>
          </FastImage>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('WorkoutList', {equipment, area: 'full'})
          }
          style={{
            margin: 20,
            marginTop: 5,
            borderRadius: 5,
            width: Dimensions.get('window').width - 40,
          }}>
          <FastImage
            style={{
              height: TILE_HEIGHT,
              justifyContent: 'flex-end',
              borderRadius: 10,
            }}
            source={require('../../../images/full_body.jpeg')}>
            <LinearGradient
              colors={[
                'rgba(54, 57, 68,0)',
                'rgba(54, 57, 68,0.8)',
                'rgb(54, 57, 68)',
              ]}
              style={{
                height: 75,
                justifyContent: 'flex-end',
                borderRadius: 10,
                padding: 10,
                marginBottom: -1,
              }}>
              <Text
                style={{
                  color: colors.appWhite,
                  fontWeight: 'bold',
                  fontSize: FONTS_SIZES.MEDIUM_LARGE,
                  marginBottom: 5,
                }}>
                Full Body
              </Text>
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: 12,
                }}>
                (Comprehensive workouts targeting all major muscle groups)
              </Text>
            </LinearGradient>
          </FastImage>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default WhatArea;
