import React from 'react';
import {View} from 'react-native';
import {useAppSelector} from '../../../hooks/redux';
import {LeaderboardType} from '../../../types/Shared';
import Leaderboard from './Leaderboard';

const caloriesType: LeaderboardType = 'dailyCalories';
const stepsType: LeaderboardType = 'dailySteps';

const Daily: React.FC<{
  tabIndex: number;
  setTabIndex: (index: number) => void;
}> = ({tabIndex, setTabIndex}) => {
  const tabs = ['Steps', 'Calories'];

  const {leaderboards} = useAppSelector(state => state.leaderboards);




  const leaderboardType: LeaderboardType =
    tabIndex === 0 ? stepsType : caloriesType;

  return (
    <View style={{flex: 1}}>
      <Leaderboard
        leaderboardType={leaderboardType}
        suffix={tabIndex === 0 ? 'steps' : 'kcal'}
      />
    </View>
  );
};

export default Daily;
