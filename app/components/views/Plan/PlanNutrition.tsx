import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import colors from '../../../constants/colors';
import Header from '../../commons/Header';
import FastImage from 'react-native-fast-image';
import {RouteProp} from '@react-navigation/native';
import {StackParamList} from '../../../App';

const PlanNutrition: React.FC<{
  route: RouteProp<StackParamList, 'Nutrition'>;
}> = ({route}) => {
  const {nutrition} = route.params;
  return (
    <ScrollView bounces={false} style={{backgroundColor: colors.appGrey}}>
      <FastImage
        style={{
          height: 350,
          marginBottom: 10,
        }}
        source={require('../../../images/nutrition.jpg')}>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: '#000',
            opacity: 0.4,
          }}
        />
      </FastImage>

      <Header hasBack absolute title="Nutrition" />

      <View
        style={{
          padding: 20,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          marginTop: -35,
          backgroundColor: colors.appGrey,
        }}>
        {!!nutrition.general && (
          <>
            <Text
              style={{
                fontSize: 25,
                fontWeight: 'bold',

                fontFamily: 'Helvetica',
                color: colors.appWhite,
              }}>
              General
            </Text>
            <Text
              style={{
                color: colors.appWhite,

                lineHeight: 30,
              }}>
              {nutrition.general}
            </Text>
          </>
        )}
        {!!nutrition.preWorkout && (
          <>
            <Text
              style={{
                fontSize: 25,
                fontWeight: 'bold',

                fontFamily: 'Helvetica',
                color: colors.appWhite,
              }}>
              Pre-workout
            </Text>
            <Text
              style={{
                color: colors.appWhite,

                lineHeight: 30,
              }}>
              {nutrition.preWorkout}
            </Text>
          </>
        )}
        {!!nutrition.postWorkout && (
          <>
            <Text
              style={{
                fontSize: 25,
                fontWeight: 'bold',

                fontFamily: 'Helvetica',
                color: colors.appWhite,
              }}>
              Post-workout
            </Text>
            <Text
              style={{
                color: colors.appWhite,

                lineHeight: 30,
              }}>
              {nutrition.postWorkout}
            </Text>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default PlanNutrition;
