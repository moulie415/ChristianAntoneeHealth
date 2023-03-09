import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {
  getDifficultyEmoji,
  getDifficultyText,
} from '../../../helpers/exercises';
import {resetToTabs} from '../../../RootNavigation';

import {saveWorkout, setShareModalVisible} from '../../../actions/exercises';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ShareModal from '../../commons/ShareModal';
import {Alert, ImageBackground, StyleSheet, View} from 'react-native';
import Button from '../../commons/Button';
import Text from '../../commons/Text';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../../constants/colors';
import FastImage from 'react-native-fast-image';
import WorkoutSummaryInfo from '../../commons/WorkoutSummaryInfo';
import {useBackHandler} from '../../../hooks/UseBackHandler';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import {RouteProp} from '@react-navigation/native';
import {SavedWorkout} from '../../../types/SavedItem';
import Profile from '../../../types/Profile';
import Exercise from '../../../types/Exercise';

const WorkoutSummary: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'WorkoutSummary'>;
  route: RouteProp<StackParamList, 'WorkoutSummary'>;
  profile: Profile;
  saveWorkoutAction: (workout: SavedWorkout) => void;
  workout: Exercise[];
  setShareModalVisibleAction: (payload: boolean) => void;
}> = ({
  route,
  profile,
  navigation,
  saveWorkoutAction,
  workout,
  setShareModalVisibleAction,
}) => {
  const {calories, seconds, difficulty, isLast} = route.params;
  const [buttonDisabled, setButtonDisabled] = useState(false);
  useBackHandler(() => true);

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
            margin: 10,
            marginBottom: 20,
          }}
        />
        {/* <Button
          text="Share workout"
          onPress={() => setShareModalVisibleAction(true)}
          style={{
            margin: 10,
            marginBottom: 20,
          }}
        />
        <ShareModal title="Share workout" type="workout" workout={workout} /> */}
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
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutSummary);
