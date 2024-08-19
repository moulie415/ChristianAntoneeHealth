import React from 'react';
import {View} from 'react-native';
import colors from '../../constants/colors';
import {useAppSelector} from '../../hooks/redux';
import {LeaderboardItem} from '../../types/Shared';
import Avatar from './Avatar';
import Text from './Text';

const LeaderboardRow: React.FC<{item: LeaderboardItem; suffix?: string}> = ({
  item,
  suffix,
}) => {
  const {profile} = useAppSelector(state => state.profile);
  const isYou = profile.uid === item.userId;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isYou ? colors.appBlue : undefined,
        padding: 10,
      }}>
      <Text
        style={{
          color: colors.appWhite,
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
        style={{color: colors.appWhite, paddingHorizontal: 10, flex: 1}}>
        {item.user ? `${item.user.name} ${item.user.surname || ''}` : ''}
      </Text>

      <Text
        style={{color: colors.appWhite, fontWeight: 'bold', marginRight: 10}}>
        {`${item.score} ${suffix || ''}`}
      </Text>
    </View>
  );
};

export default LeaderboardRow;
