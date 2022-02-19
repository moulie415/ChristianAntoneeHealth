import {
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Layout} from '@ui-kitten/components';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../../constants/colors';
import DevicePixels from '../../../helpers/DevicePixels';
import Text from '../../commons/Text';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import {RouteProp} from '@react-navigation/native';

const WhatEquipment: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'WhatEquipment'>;
  route: RouteProp<StackParamList, 'WhatEquipment'>;
}> = ({navigation, route}) => {
  const {goal} = route.params;
  return (
    <ImageBackground
      source={require('../../../images/1st_Carousel_image_targeted_workouts.jpeg')}
      style={{flex: 1}}>
      <Layout
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: '#000',
          opacity: 0.7,
        }}
      />
      <SafeAreaView style={{flex: 1}}>
        <Text
          style={{
            color: colors.appWhite,
            textAlign: 'center',
            marginTop: DevicePixels[20],
          }}
          category="h3">
          What equipment do you have?
        </Text>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('WhatExperience', {goal, equipment: 'none'})
            }
            style={{
              margin: DevicePixels[20],
              marginTop: 0,
              backgroundColor: colors.appBlue,
              padding: DevicePixels[10],
              borderColor: colors.appBlue,
              borderWidth: DevicePixels[1],
              borderRadius: DevicePixels[5],
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: colors.appWhite,
                fontWeight: 'bold',
              }}>
              I don’t have anything
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('WhatExperience', {
                goal,
                equipment: 'minimal',
              })
            }
            style={{
              margin: DevicePixels[20],
              backgroundColor: colors.appBlue,
              padding: DevicePixels[10],
              borderColor: colors.appBlue,
              borderWidth: DevicePixels[1],
              borderRadius: DevicePixels[5],
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: colors.appWhite,
                fontWeight: 'bold',
              }}>
              I’ve got a few bits and pieces
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('WhatExperience', {goal, equipment: 'full'})
            }
            style={{
              margin: DevicePixels[20],
              backgroundColor: colors.appBlue,
              padding: DevicePixels[10],
              borderColor: colors.appBlue,
              borderWidth: DevicePixels[1],
              borderRadius: DevicePixels[5],
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: colors.appWhite,
                fontWeight: 'bold',
              }}>
              I’ve got access to a gym
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default WhatEquipment;
