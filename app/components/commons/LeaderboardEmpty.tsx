import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import React from 'react';
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
        }}
      >
        No leaderboard entries yet
      </Text>
      <FontAwesome6
        name="trophy"
        color={colors.appWhite}
        size={30}
        iconStyle="solid"
        style={{ textAlign: 'center', marginTop: 15 }}
      />
    </>
  );
};

export default LeaderboardEmpty;
