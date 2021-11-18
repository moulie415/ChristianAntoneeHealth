import {Button, Layout, Text} from '@ui-kitten/components';
import React from 'react';
import moment from 'moment';
import {View} from 'react-native';
import WorkoutSummaryProps from '../../../types/views/WorkoutSummary';
import {
  getDifficultyEmoji,
  getDifficultyText,
} from '../../../helpers/exercises';
import {resetToTabs} from '../../../RootNavigation';
import DevicePixels from '../../../helpers/DevicePixels';

const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({route, navigation}) => {
  const {calories, seconds, difficulty} = route.params;
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
        style={{margin: DevicePixels[10], marginBottom: DevicePixels[20]}}>
        Save Workout
      </Button>
    </Layout>
  );
};

export default WorkoutSummary;
