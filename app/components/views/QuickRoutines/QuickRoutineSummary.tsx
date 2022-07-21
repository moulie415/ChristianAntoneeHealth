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
import {View} from 'react-native';
import Text from '../../commons/Text';
import Button from '../../commons/Button';

const QuickRoutineSummary: React.FC<QuickRoutineSummaryProps> = ({
  route,
  navigation,
  profile,
}) => {
  const {calories, seconds, difficulty, routine} = route.params;
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
        style={{
          margin: DevicePixels[10],
          marginBottom: DevicePixels[20],
        }}
      />
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(QuickRoutineSummary);
