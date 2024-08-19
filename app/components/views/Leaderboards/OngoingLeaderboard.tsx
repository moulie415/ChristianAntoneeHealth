import React, {useCallback} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import colors from '../../../constants/colors';
import {useAppDispatch, useAppSelector} from '../../../hooks/redux';
import {getLeaderboard} from '../../../reducers/leaderboards';
import {LeaderboardType} from '../../../types/Shared';
import LeaderboardEmpty from '../../commons/LeaderboardEmpty';
import LeaderboardRow from '../../commons/LeaderboardRow';

const workoutStreakType: LeaderboardType = 'workoutStreak';

const Ongoing: React.FC<{loading: boolean}> = ({loading}) => {
  const dispatch = useAppDispatch();
  const {leaderboards} = useAppSelector(state => state.leaderboards);

  const workoutStreakLeaderboard = leaderboards[workoutStreakType];

  const onRefresh = useCallback(() => {
    dispatch(getLeaderboard(workoutStreakType));
  }, [dispatch]);

  return (
    <View style={{flex: 1}}>
      <FlatList
        contentContainerStyle={{marginTop: 20}}
        data={workoutStreakLeaderboard?.leaderboard}
        ListEmptyComponent={
          workoutStreakLeaderboard?.leaderboard?.length === 0
            ? LeaderboardEmpty
            : undefined
        }
        refreshControl={
          <RefreshControl
            tintColor={colors.appWhite}
            refreshing={loading}
            onRefresh={onRefresh}
          />
        }
        renderItem={({item}) => {
          return <LeaderboardRow item={item} />;
        }}
      />
    </View>
  );
};

export default Ongoing;
