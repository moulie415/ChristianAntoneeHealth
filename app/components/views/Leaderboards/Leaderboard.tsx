import React, {useCallback} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import colors from '../../../constants/colors';
import {useAppDispatch, useAppSelector} from '../../../hooks/redux';
import {getLeaderboard} from '../../../reducers/leaderboards';
import {LeaderboardType} from '../../../types/Shared';
import LeaderboardEmpty from '../../commons/LeaderboardEmpty';
import LeaderboardRow from '../../commons/LeaderboardRow';

const Leaderboard: React.FC<{
  leaderboardType: LeaderboardType;
  suffix?: string;
}> = ({leaderboardType, suffix}) => {
  const {loading} = useAppSelector(state => state.leaderboards);

  const {leaderboards} = useAppSelector(state => state.leaderboards);

  const leaderboard = leaderboards[leaderboardType]?.leaderboard;

  const dispatch = useAppDispatch();
  const onRefresh = useCallback(() => {
    dispatch(getLeaderboard(leaderboardType));
  }, [dispatch, leaderboardType]);
  return (
    <FlatList
      data={leaderboard}
      keyExtractor={item => item.userId}
      refreshControl={
        <RefreshControl
          tintColor={colors.appWhite}
          refreshing={loading}
          onRefresh={onRefresh}
        />
      }
      ListEmptyComponent={
        leaderboard?.length === 0 ? LeaderboardEmpty : undefined
      }
      renderItem={({item}) => {
        return <LeaderboardRow item={item} suffix={suffix} />;
      }}
    />
  );
};

export default Leaderboard;
