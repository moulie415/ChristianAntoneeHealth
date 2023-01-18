import {View, TouchableOpacity, Dimensions} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../../constants/colors';
import DevicePixels from '../../../helpers/DevicePixels';
import Text from '../../commons/Text';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import FastImage from 'react-native-fast-image';

const WhatEquipment: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Workout'>;
}> = ({navigation}) => {
  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text
            style={{
              color: colors.appWhite,
              marginHorizontal: DevicePixels[20],
              fontSize: DevicePixels[22],
              fontWeight: 'bold',
            }}>
            What equipment do you have?
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('WhatArea', {
                equipment: 'minimal',
              })
            }
            style={{
              margin: DevicePixels[20],
              marginBottom: DevicePixels[10],
              width: Dimensions.get('window').width - DevicePixels[40],
            }}>
            <FastImage
              style={{
                height: DevicePixels[200],
                justifyContent: 'flex-end',
                borderRadius: DevicePixels[10],
              }}
              source={require('../../../images/bits-and-pieces.jpg')}>
              <View
                style={{
                  padding: DevicePixels[20],
                  borderBottomLeftRadius: DevicePixels[10],
                  borderBottomRightRadius: DevicePixels[10],
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: colors.appWhite,
                    fontWeight: 'bold',
                    fontSize: DevicePixels[20],
                    marginBottom: DevicePixels[10],
                  }}>
                  I’ve got a few bits and pieces
                </Text>
                <Text
                  style={{
                    color: colors.appWhite,
                    textAlign: 'center',
                    fontSize: DevicePixels[10],
                  }}>
                  (Dumbbells, exercise ball, exercise mat)
                </Text>
              </View>
            </FastImage>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('WhatArea', {equipment: 'full'})}
            style={{
              margin: DevicePixels[20],
              marginTop: DevicePixels[10],
              width: Dimensions.get('window').width - DevicePixels[40],
            }}>
            <FastImage
              style={{
                height: DevicePixels[200],
                justifyContent: 'flex-end',
                borderRadius: DevicePixels[10],
              }}
              source={require('../../../images/access-to-gym.jpg')}>
              <View
                style={{
                  padding: DevicePixels[20],
                  borderBottomLeftRadius: DevicePixels[10],
                  borderBottomRightRadius: DevicePixels[10],
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: colors.appWhite,
                    fontWeight: 'bold',
                    fontSize: DevicePixels[20],
                    marginBottom: DevicePixels[10],
                  }}>
                  I’ve got access to a gym
                </Text>
                <Text
                  style={{
                    color: colors.appWhite,
                    textAlign: 'center',
                    fontSize: DevicePixels[10],
                  }}>
                  (Dumbbells, weighted bars, bosu ball, exercise ball, exercise
                  benches Kettlebell etc)
                </Text>
              </View>
            </FastImage>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default WhatEquipment;
