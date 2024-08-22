import React from 'react';
import {LeaderboardType} from '../../../types/Shared';
import Leaderboard from './Leaderboard';
const caloriesType: LeaderboardType = 'weeklyCalories';
const stepsType: LeaderboardType = 'weeklySteps';

const Weekly: React.FC<{
  tabIndex: number;
  setTabIndex: (index: number) => void;
}> = ({tabIndex, setTabIndex}) => {
  const leaderboardType: LeaderboardType =
    tabIndex === 0 ? stepsType : caloriesType;

  return (
    <Leaderboard
      leaderboardType={leaderboardType}
      suffix={tabIndex === 0 ? 'steps' : 'kcal'}
      tabIndex={tabIndex}
      setTabIndex={setTabIndex}
    />
  );
};

export default Weekly;
