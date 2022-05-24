import {Button, Layout, Text} from '@ui-kitten/components';
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
import {Alert} from 'react-native';
import {requestPlan} from '../../../actions/profile';

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
    <Layout style={{flex: 1}}>
      <Layout
        style={{
          justifyContent: 'space-evenly',
          flex: 1,
          alignItems: 'center',
        }}>
        <Layout style={{alignItems: 'center'}}>
          <Text category="s1" style={{marginBottom: DevicePixels[20]}}>
            Calories burned
          </Text>
          <Text category="h1">{Math.floor(calories)}</Text>
        </Layout>
        <Layout style={{alignItems: 'center'}}>
          <Text category="s1" style={{marginBottom: DevicePixels[20]}}>
            Time spent active
          </Text>
          <Text category="h1">
            {moment().utc().startOf('day').add({seconds}).format('mm:ss')}
          </Text>
        </Layout>
        <Layout style={{alignItems: 'center'}}>
          <Text category="s1">Intensity</Text>
          <Text style={{fontSize: DevicePixels[100]}}>
            {getDifficultyEmoji(difficulty)}
          </Text>
          <Text category="s1">{getDifficultyText(difficulty)}</Text>
        </Layout>
      </Layout>

      <Button onPress={resetToTabs} style={{margin: DevicePixels[10]}}>
        Return Home
      </Button>
      <Button
        onPress={() => setShareModalVisibleAction(true)}
        accessoryLeft={() => <Icon name="share-alt" color="#fff" />}
        style={{margin: DevicePixels[10], marginBottom: DevicePixels[20]}}>
        Share workout
      </Button>
      <ShareModal title="Share workout" type="workout" workout={workout} />
    </Layout>
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
