import React from 'react';
import {FlatList, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import colors from '../../../constants/colors';
import {useAppSelector} from '../../../hooks/redux';
import Fire from '../../../images/fire.svg';
import {LeaderboardType} from '../../../types/Shared';
import IconTabs from '../../commons/IconTabs';
import LeaderboardEmpty from '../../commons/LeaderboardEmpty';
import LeaderboardRow from '../../commons/LeaderboardRow';
import LeaderboardTimeLeft from '../../commons/LeaderboardTimeLeft';
import PodiumItem from './PodiumItem';

const Leaderboard: React.FC<{
  leaderboardType: LeaderboardType;
  suffix?: string;
  tabIndex?: number;
  setTabIndex?: (index: number) => void;
}> = ({leaderboardType, suffix, tabIndex, setTabIndex}) => {
  const {leaderboards} = useAppSelector(state => state.leaderboards);
  const leaderboard = leaderboards[leaderboardType]?.leaderboard || [];
  const endTime = leaderboards[leaderboardType]?.endTime;

  // Extract top 3 ranks
  const podium = leaderboard.filter(item => item.rank <= 3);
  const remainingLeaderboard = leaderboard.filter(item => item.rank > 3);

  const rank1 = podium.find(item => item.rank === 1);
  const rank2 = podium.find(item => item.rank === 2);
  const rank3 = podium.find(item => item.rank === 3);
  return (
    <View style={{marginTop: 20, flex: 1}}>
      <FlatList
        bounces={false}
        ListHeaderComponent={
          <View style={{backgroundColor: colors.appGrey}}>
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

            {tabIndex !== undefined && !!setTabIndex && (
              <View style={{position: 'absolute', left: 20, top: 5}}>
                <IconTabs
                  setTabIndex={setTabIndex}
                  tabIndex={tabIndex}
                  icons={[
                    {
                      icon: (
                        <Icon
                          name="shoe-prints"
                          size={15}
                          color={colors.button}
                        />
                      ),
                      key: 'steps',
                    },
                    {icon: <Fire width={30} />, key: 'calories'},
                  ]}
                />
              </View>
            )}

            {!!endTime && (
              <View style={{position: 'absolute', right: 10, top: -20}}>
                <LeaderboardTimeLeft endTime={endTime} />
              </View>
            )}
          </View>
        }
        data={remainingLeaderboard}
        contentContainerStyle={{
          backgroundColor: remainingLeaderboard.length
            ? colors.tile
            : colors.appGrey,
          flex: 1,
        }}
        keyExtractor={item => item.userId}
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
