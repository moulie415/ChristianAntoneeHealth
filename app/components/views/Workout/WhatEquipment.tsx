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
      source={require('../../../images/Fitness_testing_squat.jpeg')}
      style={{flex: 1}}>
      <Layout
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: '#000',
          opacity: 0.8,
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
            onPress={() => 0}
            style={{
              margin: DevicePixels[20],
              backgroundColor: colors.appBlue,
              padding: DevicePixels[10],
              borderColor: colors.appBlue,
              borderWidth: DevicePixels[1],
              borderRadius: DevicePixels[5],
            }}>
            <Text
              category="h5"
              style={{
                color: colors.appWhite,
                fontWeight: 'bold',
              }}>
              Improve my strength
            </Text>
            <Text style={{color: colors.appWhite}}>
              Target specific areas to improve your strength and build long lean
              muscles
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => 0}
            style={{
              margin: DevicePixels[20],

              backgroundColor: colors.appBlue,
              padding: DevicePixels[10],
              borderColor: colors.appBlue,
              borderWidth: DevicePixels[1],
              borderRadius: DevicePixels[5],
            }}>
            <Text
              category="h5"
              style={{
                color: colors.appWhite,
                fontWeight: 'bold',
              }}>
              Improve my fitness
            </Text>
            <Text style={{color: colors.appWhite}}>
              Mix it up with high intensity, dynamic and functional workouts
              designed to get you sweating!
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default WhatEquipment;
