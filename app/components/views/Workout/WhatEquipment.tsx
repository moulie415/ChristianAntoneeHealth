import {
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../../constants/colors';
import DevicePixels from '../../../helpers/DevicePixels';
import Text from '../../commons/Text';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import {RouteProp} from '@react-navigation/native';

const WhatEquipment: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Workout'>;
}> = ({navigation}) => {
  return (
    <ImageBackground
      source={require('../../../images/old-black-background-grunge.png')}
      blurRadius={5}
      style={{flex: 1}}>
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
            }}>
            <ImageBackground
              imageStyle={{borderRadius: DevicePixels[10]}}
              style={{
                height: DevicePixels[200],
                justifyContent: 'flex-end',
              }}
              source={require('../../../images/bits-and-pieces.jpg')}>
              <ImageBackground
                source={require('../../../images/BlackTransparentBackground.png')}
                blurRadius={3}
                imageStyle={{
                  borderBottomLeftRadius: DevicePixels[10],
                  borderBottomRightRadius: DevicePixels[10],
                }}
                style={{
                  padding: DevicePixels[20],
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
              </ImageBackground>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('WhatArea', {equipment: 'full'})}
            style={{
              margin: DevicePixels[20],
              marginTop: DevicePixels[10],
            }}>
            <ImageBackground
              imageStyle={{borderRadius: DevicePixels[10]}}
              style={{
                height: DevicePixels[200],
                justifyContent: 'flex-end',
              }}
              source={require('../../../images/access-to-gym.jpg')}>
              <ImageBackground
                source={require('../../../images/BlackTransparentBackground.png')}
                blurRadius={3}
                imageStyle={{
                  borderBottomLeftRadius: DevicePixels[10],
                  borderBottomRightRadius: DevicePixels[10],
                }}
                style={{
                  padding: DevicePixels[20],
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
              </ImageBackground>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default WhatEquipment;
