import React from 'react';
import {View} from 'react-native';
import {useAppSelector} from '../../../hooks/redux';
import {LeaderboardType} from '../../../types/Shared';
import LeaderboardTimeLeft from '../../commons/LeaderboardTimeLeft';
import MyTabs from '../../commons/MyTabs';
import Leaderboard from './Leaderboard';

const caloriesType: LeaderboardType = 'weeklyCalories';
const stepsType: LeaderboardType = 'weeklySteps';

const Weekly: React.FC<{
  tabIndex: number;
  setTabIndex: (index: number) => void;
}> = ({tabIndex, setTabIndex}) => {
  const tabs = ['Steps', 'Calories'];

  const {leaderboards} = useAppSelector(state => state.leaderboards);

  const calorieLeaderboard = leaderboards[caloriesType];
  const stepsLeaderboard = leaderboards[stepsType];

  const endTime =
    tabIndex === 0 ? stepsLeaderboard?.endTime : calorieLeaderboard?.endTime;

  const leaderboardType: LeaderboardType =
    tabIndex === 0 ? stepsType : caloriesType;

  return (
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <MyTabs tabs={tabs} tabIndex={tabIndex} setTabIndex={setTabIndex} />
        {endTime && <LeaderboardTimeLeft endTime={endTime} />}
      </View>

      <Leaderboard
        leaderboardType={leaderboardType}
        suffix={tabIndex === 0 ? 'steps' : 'kcal'}
      />
    </View>
  );
};

export default Weekly;
