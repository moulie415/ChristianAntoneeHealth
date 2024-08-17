import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import colors from '../../constants/colors';
import Text from './Text';

const LeaderboardEmpty = () => {
  return (
    <>
      <Text
        style={{
          textAlign: 'center',
          color: colors.appWhite,
          fontSize: 16,
          marginTop: 20,
        }}>
        No leaderboard entries yet
      </Text>
      <Icon
        name="trophy"
        color={colors.appWhite}
        size={30}
        style={{textAlign: 'center', marginTop: 15}}
      />
    </>
  );
};

export default LeaderboardEmpty;
