import React from 'react';
import {View} from 'react-native';
import colors from '../../constants/colors';
import {useAppSelector} from '../../hooks/redux';
import {LeaderboardItem} from '../../types/Shared';
import Avatar from './Avatar';
import Text from './Text';

const LeaderboardRow: React.FC<{
  item: LeaderboardItem;
  suffix?: string;
  index: number;
}> = ({item, suffix, index}) => {
  const {profile} = useAppSelector(state => state.profile);
  const isYou = profile.uid === item.userId;
  return (
    <View
      style={{
        borderTopLeftRadius: index === 0 ? 30 : 0,
        borderTopRightRadius: index === 0 ? 30 : 0,
        marginTop: index === 0 ? -30 : 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isYou ? colors.appBlue : colors.tile,
        paddingTop: index === 0 ? 20 : 10,
        padding: 10,
      }}>
      <Text
        style={{
          color: isYou ? colors.appWhite : colors.appWhite,
          fontWeight: 'bold',
          paddingRight: 10,
          fontSize: 16,
        }}>
        {item.rank}
      </Text>
      <Avatar
        size={40}
        src={item.user?.avatar}
        name={item.user ? `${item.user.name} ${item.user.surname || ''}` : ''}
        uid={item.userId}
      />
      <Text
        numberOfLines={1}
        style={{
          color: isYou ? colors.appWhite : colors.appWhite,
          paddingHorizontal: 10,
          flex: 1,
        }}>
        {item.user ? `${item.user.name} ${item.user.surname || ''}` : ''}
      </Text>

      <Text
        style={{
          color: isYou ? colors.appWhite : colors.appWhite,
          fontWeight: 'bold',
          marginRight: 10,
        }}>
        {`${item.score} ${suffix || ''}`}
      </Text>
    </View>
  );
};

export default LeaderboardRow;
