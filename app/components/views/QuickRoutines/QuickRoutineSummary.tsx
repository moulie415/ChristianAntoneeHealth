import React, {useState} from 'react';
import moment from 'moment';
import {
  getDifficultyEmoji,
  getDifficultyText,
} from '../../../helpers/exercises';
import {resetToTabs} from '../../../RootNavigation';
import {RootState} from '../../../App';
import {connect} from 'react-redux';
import QuickRoutineSummaryProps from '../../../types/views/QuickRoutineSummary';
import {ImageBackground, View, StyleSheet} from 'react-native';
import Text from '../../commons/Text';
import Button from '../../commons/Button';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../commons/Header';
import colors from '../../../constants/colors';
import FastImage from 'react-native-fast-image';
import {rpeSliderScale} from '../../commons/RPESlider';
import WorkoutSummaryInfo from '../../commons/WorkoutSummaryInfo';
import {useBackHandler} from '../../../hooks/UseBackHandler';

const QuickRoutineSummary: React.FC<QuickRoutineSummaryProps> = ({
  route,
  navigation,
  profile,
}) => {
  const {calories, seconds, difficulty, routine, averageHeartRate} =
    route.params;
  useBackHandler(() => true);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.appGrey}}>
      <WorkoutSummaryInfo
        calories={calories}
        difficulty={difficulty}
        seconds={seconds}
        averageHeartRate={averageHeartRate}
      />

      <Button
        text="Return Home"
        onPress={resetToTabs}
        style={{
          margin: 20,
          marginTop: 10,
        }}
      />
    </SafeAreaView>
  );
};

const mapStateToProps = ({profile}: RootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(QuickRoutineSummary);
