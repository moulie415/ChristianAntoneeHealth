import React from 'react';
import {View} from 'react-native';
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
    <View style={{flex: 1}}>
      <Leaderboard
        leaderboardType={leaderboardType}
        suffix={tabIndex === 0 ? 'steps' : 'kcal'}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
      />
    </View>
  );
};

export default Weekly;
