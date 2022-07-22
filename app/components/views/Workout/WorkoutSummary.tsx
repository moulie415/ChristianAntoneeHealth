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
import {Alert, View} from 'react-native';
import {requestPlan} from '../../../actions/profile';
import Button from '../../commons/Button';
import Text from '../../commons/Text';

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
    <View style={{flex: 1}}>
      <View
        style={{
          justifyContent: 'space-evenly',
          flex: 1,
          alignItems: 'center',
        }}>
        <View style={{alignItems: 'center'}}>
          <Text style={{marginBottom: DevicePixels[20]}}>Calories burned</Text>
          <Text>{Math.floor(calories)}</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={{marginBottom: DevicePixels[20]}}>
            Time spent active
          </Text>
          <Text>
            {moment().utc().startOf('day').add({seconds}).format('mm:ss')}
          </Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text>Intensity</Text>
          <Text style={{fontSize: DevicePixels[100]}}>
            {getDifficultyEmoji(difficulty)}
          </Text>
          <Text>{getDifficultyText(difficulty)}</Text>
        </View>
      </View>

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
    </View>
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
