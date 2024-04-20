import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {RootState, StackParamList} from '../../../App';
import {resetToTabs} from '../../../RootNavigation';
import colors from '../../../constants/colors';
import {useBackHandler} from '../../../hooks/UseBackHandler';
import {saveWorkout, setShareModalVisible} from '../../../reducers/exercises';
import Exercise from '../../../types/Exercise';
import {SavedWorkout} from '../../../types/SavedItem';
import {Profile} from '../../../types/Shared';
import Button from '../../commons/Button';
import WorkoutSummaryInfo from '../../commons/WorkoutSummaryInfo';

const WorkoutSummary: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'WorkoutSummary'>;
  route: RouteProp<StackParamList, 'WorkoutSummary'>;
  profile: Profile;
  saveWorkoutAction: (workout: SavedWorkout) => void;
  workout: Exercise[];
  setShareModalVisibleAction: (payload: boolean) => void;
}> = ({route}) => {
  const {calories, seconds, difficulty, averageHeartRate} = route.params;
  const [buttonDisabled, setButtonDisabled] = useState(false);
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
  );
};

const mapStateToProps = ({profile, exercises}: RootState) => ({
  profile: profile.profile,
  workout: exercises.workout,
});

const mapDispatchToProps = {
  saveWorkoutAction: saveWorkout,
  setShareModalVisibleAction: setShareModalVisible,
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutSummary);
