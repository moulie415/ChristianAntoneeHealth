import React from 'react';
import { LeaderboardType } from '../../../types/Shared';
import Leaderboard from './Leaderboard';

const workoutStreakType: LeaderboardType = 'workoutStreak';

const Ongoing: React.FC = () => {
  return <Leaderboard leaderboardType={workoutStreakType} />;
};

export default Ongoing;
