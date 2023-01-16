import React, {useEffect, useState} from 'react';
import moment from 'moment';
import WorkoutSummaryProps from '../../../types/views/WorkoutSummary';
import {
  getDifficultyEmoji,
  getDifficultyText,
} from '../../../helpers/exercises';
import {resetToTabs} from '../../../RootNavigation';
import DevicePixels from '../../../helpers/DevicePixels';
import {saveWorkout, setShareModalVisible} from '../../../actions/exercises';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ShareModal from '../../commons/ShareModal';
import {Alert, ImageBackground, StyleSheet, View} from 'react-native';
import {requestPlan} from '../../../actions/profile';
import Button from '../../commons/Button';
import Text from '../../commons/Text';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../../constants/colors';
import FastImage from 'react-native-fast-image';
import WorkoutSummaryInfo from '../../commons/WorkoutSummaryInfo';
import {useBackHandler} from '../../../hooks/UseBackHandler';

const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({
  route,
  profile,
  navigation,
  saveWorkoutAction,
  workout,
  setShareModalVisibleAction,
  requestPlan: requestPlanAction,
}) => {
  const {calories, seconds, difficulty, isLast} = route.params;
  const [buttonDisabled, setButtonDisabled] = useState(false);
  useBackHandler(() => true);

  useEffect(() => {
    if (isLast) {
      Alert.alert(
        'Want a new plan?',
        'That was the last workout in your plan do you want to request a new plan?',
        [
          {text: 'Yes', onPress: requestPlanAction},
          {text: 'No', style: 'cancel'},
        ],
      );
    }
  }, [isLast, requestPlanAction]);
  return (
    <FastImage
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
        <WorkoutSummaryInfo
          calories={calories}
          difficulty={difficulty}
          seconds={seconds}
        />

        <Button
          text="Return Home"
          onPress={resetToTabs}
          style={{
            margin: DevicePixels[10],
            marginBottom: DevicePixels[20],
          }}
        />
        <Button
          text="Return Home"
          onPress={resetToTabs}
          style={{margin: DevicePixels[10]}}
        />
        <Button
          text="Share workout"
          onPress={() => setShareModalVisibleAction(true)}
          style={{
            margin: DevicePixels[10],
            marginBottom: DevicePixels[20],
          }}
        />
        <ShareModal title="Share workout" type="workout" workout={workout} />
      </SafeAreaView>
    </FastImage>
  );
};

const mapStateToProps = ({profile, exercises}: MyRootState) => ({
  profile: profile.profile,
  workout: exercises.workout,
});

const mapDispatchToProps = {
  saveWorkoutAction: saveWorkout,
  setShareModalVisibleAction: setShareModalVisible,
  requestPlan,
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutSummary);
