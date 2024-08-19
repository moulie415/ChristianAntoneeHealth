import React, {useCallback} from 'react';
import {RefreshControl, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import colors from '../../../constants/colors';
import {useAppDispatch, useAppSelector} from '../../../hooks/redux';
import {getLeaderboard} from '../../../reducers/leaderboards';
import {LeaderboardType} from '../../../types/Shared';
import LeaderboardEmpty from '../../commons/LeaderboardEmpty';
import LeaderboardRow from '../../commons/LeaderboardRow';
import LeaderboardTimeLeft from '../../commons/LeaderboardTimeLeft';
import MyTabs from '../../commons/MyTabs';

const caloriesType: LeaderboardType = 'weeklyCalories';
const stepsType: LeaderboardType = 'weeklySteps';

const Weekly: React.FC<{
  tabIndex: number;
  setTabIndex: (index: number) => void;
  loading: boolean;
}> = ({tabIndex, setTabIndex, loading}) => {
  const dispatch = useAppDispatch();
  const tabs = ['Steps', 'Calories'];

  const {leaderboards} = useAppSelector(state => state.leaderboards);

  const calorieLeaderboard = leaderboards[caloriesType];
  const stepsLeaderboard = leaderboards[stepsType];

  const onRefresh = useCallback(() => {
    dispatch(getLeaderboard(tabIndex === 0 ? stepsType : caloriesType));
  }, [dispatch, tabIndex]);

  const endTime =
    tabIndex === 0 ? stepsLeaderboard?.endTime : calorieLeaderboard?.endTime;

  const leaderboard =
    tabIndex === 0
      ? stepsLeaderboard?.leaderboard
      : calorieLeaderboard?.leaderboard;

  return (
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <MyTabs tabs={tabs} tabIndex={tabIndex} setTabIndex={setTabIndex} />
        {endTime && <LeaderboardTimeLeft endTime={endTime} />}
      </View>
      <FlatList
        data={leaderboard}
        ListEmptyComponent={
          leaderboard?.length === 0 ? LeaderboardEmpty : undefined
        }
        refreshControl={
          <RefreshControl
            tintColor={colors.appWhite}
            refreshing={loading}
            onRefresh={onRefresh}
          />
        }
        renderItem={({item}) => {
          return (
            <LeaderboardRow
              item={item}
              suffix={tabIndex === 0 ? 'steps' : 'kcal'}
            />
          );
        }}
      />
    </View>
  );
};

export default Weekly;
