import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import colors from '../../../constants/colors';
import {useAppDispatch, useAppSelector} from '../../../hooks/redux';
import {getLeaderboard} from '../../../reducers/leaderboards';
import {LeaderboardType} from '../../../types/Shared';
import LeaderboardEmpty from '../../commons/LeaderboardEmpty';
import LeaderboardRow from '../../commons/LeaderboardRow';
import MyTabs from '../../commons/MyTabs';

const caloriesType: LeaderboardType = 'weeklyCalories';
const stepsType: LeaderboardType = 'weeklySteps';

const Weekly = () => {
  const dispatch = useAppDispatch();
  const tabs = ['Steps', 'Calories'];

  const [tabIndex, setTabIndex] = useState(0);

  const {leaderboards, loading} = useAppSelector(state => state.leaderboards);

  const calorieLeaderboard = leaderboards[caloriesType];
  const stepsLeaderboard = leaderboards[stepsType];

  useEffect(() => {
    dispatch(getLeaderboard(tabIndex === 0 ? stepsType : caloriesType));
  }, [dispatch, tabIndex]);

  const onRefresh = useCallback(() => {
    dispatch(getLeaderboard(tabIndex === 0 ? stepsType : caloriesType));
  }, [dispatch, tabIndex]);

  const leaderboard =
    tabIndex === 0
      ? stepsLeaderboard?.leaderboard
      : calorieLeaderboard?.leaderboard;

  return (
    <View style={{flex: 1}}>
      <MyTabs tabs={tabs} tabIndex={tabIndex} setTabIndex={setTabIndex} />
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
