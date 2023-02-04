import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {StackParamList} from '../../../App';
import colors from '../../../constants/colors';

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
            margin: 20,
            fontSize: 22,
            fontWeight: 'bold',
          }}>
          What the body area you want to focus on from here
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
              height: 120,
              justifyContent: 'flex-end',
              borderRadius: 10,
            }}
            source={require('../../../images/upper-body.jpg')}>
            <View
              style={{
                height: 120,
                justifyContent: 'center',
                borderRadius: 10,
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <Text
                style={{
                  color: colors.appWhite,
                  fontWeight: 'bold',
                  marginLeft: 25,
                  fontSize: 22,
                }}>
                UPPER BODY
              </Text>
            </View>
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
              height: 120,
              justifyContent: 'flex-end',
              borderRadius: 10,
            }}
            source={require('../../../images/lower-body.jpg')}>
            <View
              style={{
                height: 120,
                justifyContent: 'center',
                borderRadius: 10,
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <Text
                style={{
                  color: colors.appWhite,
                  fontWeight: 'bold',
                  marginLeft: 25,
                  fontSize: 22,
                }}>
                LOWER BODY
              </Text>
            </View>
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
              height: 120,
              justifyContent: 'flex-end',
              borderRadius: 10,
            }}
            source={require('../../../images/full-body.jpg')}>
            <View
              style={{
                height: 120,
                justifyContent: 'center',
                borderRadius: 10,
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <Text
                style={{
                  color: colors.appWhite,
                  fontWeight: 'bold',
                  marginLeft: 25,
                  fontSize: 22,
                }}>
                FULL BODY
              </Text>
            </View>
          </FastImage>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default WhatArea;
