import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import DevicePixels from '../../../helpers/DevicePixels';
import Header from '../../commons/Header';
import Text from '../../commons/Text';

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
            margin: DevicePixels[20],
            fontSize: DevicePixels[22],
            fontWeight: 'bold',
          }}>
          What area do you want to focus on?
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('WorkoutList', {equipment, area: 'upper'})
          }
          style={{
            margin: DevicePixels[20],
            marginTop: DevicePixels[5],
            borderRadius: DevicePixels[5],
          }}>
          <FastImage
            style={{
              height: DevicePixels[120],
              justifyContent: 'flex-end',
              borderRadius: DevicePixels[10],
            }}
            source={require('../../../images/upper-body.jpg')}>
            <FastImage
              source={require('../../../images/BlackTransparentBackground.png')}
              blurRadius={3}
              style={{
                height: DevicePixels[120],
                justifyContent: 'center',
                borderRadius: DevicePixels[10],
              }}>
              <Text
                style={{
                  color: colors.appWhite,
                  fontWeight: 'bold',
                  marginLeft: DevicePixels[25],
                  fontSize: DevicePixels[22],
                }}>
                UPPER BODY
              </Text>
            </FastImage>
          </FastImage>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('WorkoutList', {equipment, area: 'lower'})
          }
          style={{
            margin: DevicePixels[20],
            marginTop: DevicePixels[5],
            borderRadius: DevicePixels[5],
          }}>
          <FastImage
            style={{
              height: DevicePixels[120],
              justifyContent: 'flex-end',
              borderRadius: DevicePixels[10]
            }}
            source={require('../../../images/lower-body.jpg')}>
            <FastImage
              source={require('../../../images/BlackTransparentBackground.png')}
              blurRadius={3}
              style={{
                height: DevicePixels[120],
                justifyContent: 'center',
                borderRadius: DevicePixels[10],
              }}>
              <Text
                style={{
                  color: colors.appWhite,
                  fontWeight: 'bold',
                  marginLeft: DevicePixels[25],
                  fontSize: DevicePixels[22],
                }}>
                LOWER BODY
              </Text>
            </FastImage>
          </FastImage>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('WorkoutList', {equipment, area: 'full'})
          }
          style={{
            margin: DevicePixels[20],
            marginTop: DevicePixels[5],
            borderRadius: DevicePixels[5],
          }}>
          <FastImage
            style={{
              height: DevicePixels[120],
              justifyContent: 'flex-end',
              borderRadius: DevicePixels[10],
            }}
            source={require('../../../images/full-body.jpg')}>
            <FastImage
              source={require('../../../images/BlackTransparentBackground.png')}
              blurRadius={3}
              style={{
                height: DevicePixels[120],
                justifyContent: 'center',
                borderRadius: DevicePixels[10],
              }}>
              <Text
                style={{
                  color: colors.appWhite,
                  fontWeight: 'bold',
                  marginLeft: DevicePixels[25],
                  fontSize: DevicePixels[22],
                }}>
                FULL BODY
              </Text>
            </FastImage>
          </FastImage>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default WhatArea;
