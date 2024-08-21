import React from 'react';
import {View} from 'react-native';
import {LeaderboardType} from '../../../types/Shared';
import Leaderboard from './Leaderboard';

const workoutStreakType: LeaderboardType = 'workoutStreak';

const Ongoing: React.FC = () => {
  return (
    <View style={{flex: 1, marginTop: 20}}>
      <Leaderboard leaderboardType={workoutStreakType} />
    </View>
  );
};

export default Ongoing;
