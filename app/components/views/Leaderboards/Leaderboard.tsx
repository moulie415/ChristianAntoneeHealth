import React, {useCallback} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import colors from '../../../constants/colors';
import {useAppDispatch, useAppSelector} from '../../../hooks/redux';
import {getLeaderboard} from '../../../reducers/leaderboards';
import {LeaderboardType} from '../../../types/Shared';
import LeaderboardEmpty from '../../commons/LeaderboardEmpty';
import LeaderboardRow from '../../commons/LeaderboardRow';
import LeaderboardTimeLeft from '../../commons/LeaderboardTimeLeft';
import PodiumItem from './PodiumItem';

const Leaderboard: React.FC<{
  leaderboardType: LeaderboardType;
  suffix?: string;
}> = ({leaderboardType, suffix}) => {
  const {loading} = useAppSelector(state => state.leaderboards);
  const {leaderboards} = useAppSelector(state => state.leaderboards);
  const leaderboard = leaderboards[leaderboardType]?.leaderboard || [];
  const endTime = leaderboards[leaderboardType]?.endTime;
  const dispatch = useAppDispatch();

  // Extract top 3 ranks
  const podium = leaderboard.filter(item => item.rank <= 3);
  const remainingLeaderboard = leaderboard.filter(item => item.rank > 3);

  const onRefresh = useCallback(() => {
    dispatch(getLeaderboard(leaderboardType));
  }, [dispatch, leaderboardType]);

  const rank1 = podium.find(item => item.rank === 1);
  const rank2 = podium.find(item => item.rank === 2);
  const rank3 = podium.find(item => item.rank === 3);
  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey, marginTop: 20}}>
      {/* Leaderboard List */}
      <FlatList
        ListHeaderComponent={
          <View style={{backgroundColor: colors.appGrey}}>
            {!!endTime && (
              <View style={{position: 'absolute', right: 10, top: -20}}>
                <LeaderboardTimeLeft endTime={endTime} />
              </View>
            )}

            <View
              style={{
                paddingBottom: 50,
                justifyContent: 'space-evenly',
                flexDirection: 'row',
              }}>
              <PodiumItem item={rank2} suffix={suffix} />
              <PodiumItem item={rank1} suffix={suffix} />
              <PodiumItem item={rank3} suffix={suffix} />
            </View>
          </View>
        }
        data={remainingLeaderboard}
        contentContainerStyle={{
          flex: 1,
          backgroundColor: remainingLeaderboard.length
            ? colors.appWhite
            : colors.appGrey,
        }}
        keyExtractor={item => item.userId}
        refreshControl={
          <RefreshControl
            style={{backgroundColor: colors.appGrey}}
            tintColor={colors.appWhite}
            refreshing={loading}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          leaderboard.length === 0 ? LeaderboardEmpty : undefined
        }
        renderItem={({item, index}) => {
          return <LeaderboardRow item={item} index={index} suffix={suffix} />;
        }}
      />
    </View>
  );
};

export default Leaderboard;
