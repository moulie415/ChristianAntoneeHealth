import {Button, Layout} from '@ui-kitten/components';
import React from 'react';
import {View, Text} from 'react-native';
import WorkoutSummaryProps from '../../types/views/WorkoutSummary';

const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({route, navigation}) => {
  const {calories, seconds, difficulty} = route.params;
  return (
    <Layout>
      <Button>Return Home</Button>
      <Button>Save Workout</Button>
    </Layout>
  );
};

export default WorkoutSummary;
