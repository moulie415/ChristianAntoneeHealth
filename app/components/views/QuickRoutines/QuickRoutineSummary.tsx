import React, {useState} from 'react';
import moment from 'moment';
import {
  getDifficultyEmoji,
  getDifficultyText,
} from '../../../helpers/exercises';
import {resetToTabs} from '../../../RootNavigation';
import DevicePixels from '../../../helpers/DevicePixels';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import QuickRoutineSummaryProps from '../../../types/views/QuickRoutineSummary';
import {ImageBackground, View, StyleSheet} from 'react-native';
import Text from '../../commons/Text';
import Button from '../../commons/Button';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../commons/Header';
import colors from '../../../constants/colors';

const QuickRoutineSummary: React.FC<QuickRoutineSummaryProps> = ({
  route,
  navigation,
  profile,
}) => {
  const {calories, seconds, difficulty, routine} = route.params;
  return (
    <ImageBackground
      source={require('../../../images/login.jpeg')}
      blurRadius={5}
      style={{flex: 1}}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.appBlack,
          opacity: 0.7,
        }}
      />
      <SafeAreaView style={{flex: 1}}>
        <Text
          style={{
            color: colors.appWhite,
            fontSize: DevicePixels[22],
            fontWeight: 'bold',
            textAlign: 'center',
            margin: DevicePixels[20],
          }}>
          Summary
        </Text>
        <View
          style={{
            justifyContent: 'space-evenly',
            flex: 1,
            alignItems: 'center',
          }}>
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                marginBottom: DevicePixels[20],
                color: colors.appWhite,
                fontSize: DevicePixels[20],
              }}>
              Calories burned
            </Text>
            <Text
              style={{
                color: colors.appWhite,
                fontSize: DevicePixels[30],
                fontWeight: 'bold',
              }}>
              {Math.floor(calories)}
            </Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                marginBottom: DevicePixels[20],
                color: colors.appWhite,
                fontSize: DevicePixels[20],
              }}>
              Time spent active
            </Text>
            <Text
              style={{
                color: colors.appWhite,
                fontSize: DevicePixels[30],
                fontWeight: 'bold',
              }}>
              {moment().utc().startOf('day').add({seconds}).format('mm:ss')}
            </Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={{color: colors.appWhite, fontSize: DevicePixels[20]}}>
              Intensity
            </Text>
            <Text style={{fontSize: DevicePixels[100], color: colors.appWhite}}>
              {getDifficultyEmoji(difficulty)}
            </Text>
            <Text
              style={{
                color: colors.appWhite,
                fontSize: DevicePixels[25],
                fontWeight: 'bold',
              }}>
              {getDifficultyText(difficulty)}
            </Text>
          </View>
        </View>

        <Button
          text="Return Home"
          onPress={resetToTabs}
          style={{
            margin: DevicePixels[10],
            marginBottom: DevicePixels[20],
          }}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(QuickRoutineSummary);
