import {View, TouchableOpacity, Dimensions} from 'react-native';
import React, {MutableRefObject} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../../constants/colors';

import Text from '../../commons/Text';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import FastImage from 'react-native-fast-image';
import Header from '../../commons/Header';
import LinearGradient from 'react-native-linear-gradient';


const TILE_HEIGHT = Dimensions.get('window').height / 5;

const WhatEquipment: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Workout'>;
}> = ({navigation}) => {
  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView style={{flex: 1}}>
        <Header showDrawerMenuButton />

        <View style={{flex: 1}}>
          <Text
            style={{
              color: colors.appWhite,
              marginHorizontal: 20,
              fontSize: 24,
              fontWeight: 'bold',
            }}>
            What equipment do you have?
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('WhatArea', {
                equipment: 'none',
              })
            }
            style={{
              margin: 20,
              marginBottom: 10,
              width: Dimensions.get('window').width - 40,
            }}>
            <FastImage
              style={{
                height: TILE_HEIGHT,
                justifyContent: 'flex-end',
                borderRadius: 10,
              }}
              source={require('../../../images/Equipment-none.jpeg')}>
              <LinearGradient
                colors={[
                  'rgba(54, 57, 68,0)',
                  'rgba(54, 57, 68,0.8)',
                  'rgb(54, 57, 68)',
                ]}
                style={{
                  padding: 15,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  height: 150,
                  justifyContent: 'flex-end',
                }}>
                <Text
                  style={{
                    color: colors.appWhite,
                    fontWeight: 'bold',
                    fontSize: 18,
                    // marginBottom: 10,
                  }}>
                  I’ve got no equipment
                </Text>
                {/* <Text
                  style={{
                    color: colors.appWhite,
                    fontSize: 14,
                  }}>
                  (Dumbbells, exercise ball, exercise mat)
                </Text> */}
              </LinearGradient>
            </FastImage>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('WhatArea', {
                equipment: 'minimal',
              })
            }
            style={{
              margin: 20,
              marginBottom: 10,
              width: Dimensions.get('window').width - 40,
            }}>
            <FastImage
              style={{
                height: TILE_HEIGHT,
                justifyContent: 'flex-end',
                borderRadius: 10,
              }}
              source={require('../../../images/Equipment-minimal.jpeg')}>
              <LinearGradient
                colors={[
                  'rgba(54, 57, 68,0)',
                  'rgba(54, 57, 68,0.8)',
                  'rgb(54, 57, 68)',
                ]}
                style={{
                  padding: 15,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  height: 150,
                  justifyContent: 'flex-end',
                }}>
                <Text
                  style={{
                    color: colors.appWhite,
                    fontWeight: 'bold',
                    fontSize: 18,
                    marginBottom: 5,
                  }}>
                  I’ve got a few bits and pieces
                </Text>
                <Text
                  style={{
                    color: colors.appWhite,
                    fontSize: 12,
                  }}>
                  (Dumbbells, exercise ball, exercise mat)
                </Text>
              </LinearGradient>
            </FastImage>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('WhatArea', {equipment: 'full'})}
            style={{
              margin: 20,
              marginTop: 10,
              width: Dimensions.get('window').width - 40,
            }}>
            <FastImage
              style={{
                height: TILE_HEIGHT,
                justifyContent: 'flex-end',
                borderRadius: 10,
              }}
              source={require('../../../images/Equipment-full.jpeg')}>
              <LinearGradient
                colors={[
                  'rgba(54, 57, 68,0)',
                  'rgba(54, 57, 68,0.8)',
                  'rgb(54, 57, 68)',
                ]}
                style={{
                  padding: 15,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  height: 150,
                  justifyContent: 'flex-end',
                }}>
                <Text
                  style={{
                    color: colors.appWhite,
                    fontWeight: 'bold',
                    fontSize: 18,
                    marginBottom: 5,
                  }}>
                  I’ve got access to a gym
                </Text>
                <Text
                  style={{
                    color: colors.appWhite,
                    fontSize: 12,
                  }}>
                  (Dumbbells, weighted bars, bosu ball, exercise ball, exercise
                  benches Kettlebell etc)
                </Text>
              </LinearGradient>
            </FastImage>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default WhatEquipment;
