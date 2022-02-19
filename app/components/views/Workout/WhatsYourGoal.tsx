import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Layout} from '@ui-kitten/components';
import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import DevicePixels from '../../../helpers/DevicePixels';
import {Goal} from '../../../types/Shared';
import Text from '../../commons/Text';

const WhatsYourGoal: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Workout'>;
}> = ({navigation}) => {
  return (
    <ImageBackground
      source={require('../../../images/Fitness_testing_squat.jpeg')}
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
          What's your goal?
        </Text>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('WhatEquipment', {goal: Goal.STRENGTH})
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
            onPress={() =>
              navigation.navigate('WhatEquipment', {goal: Goal.FITNESS})
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

export default WhatsYourGoal;
