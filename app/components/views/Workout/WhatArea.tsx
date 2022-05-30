import {RouteProp} from '@react-navigation/native';
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
import Text from '../../commons/Text';

const WhatArea: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'WhatArea'>;
  route: RouteProp<StackParamList, 'WhatArea'>;
}> = ({navigation, route}) => {
  const {equipment} = route.params;
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
          What area do you want to focus on?
        </Text>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('WorkoutList', {equipment, area: 'upper'})
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
                textAlign: 'center',
              }}>
              UPPER BODY
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('WorkoutList', {equipment, area: 'lower'})
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
                textAlign: 'center',
              }}>
              LOWER BODY
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('WorkoutList', {equipment, area: 'full'})
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
                textAlign: 'center',
              }}>
              FULL BODY
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default WhatArea;
