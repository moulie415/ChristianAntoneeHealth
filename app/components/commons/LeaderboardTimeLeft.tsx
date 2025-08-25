import moment from 'moment';
import React, { useState } from 'react';
import { View } from 'react-native';
import colors from '../../constants/colors';
import useInterval from '../../hooks/UseInterval';
import Text from './Text';

const LeaderboardTimeLeft: React.FC<{ endTime: number }> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState<number>(endTime - moment().unix());

  useInterval(() => {
    const now = moment().unix();
    setTimeLeft(now > endTime ? 0 : endTime - now);
  }, 1000);

  const formatTimeLeft = () => {
    const duration = moment.duration(timeLeft, 'seconds');
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    if (days >= 1) {
      return `${days} day${days > 1 ? 's' : ''}`;
    } else {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        marginTop: 15,
      }}
    >
      <Text style={{ color: colors.appWhite, textAlign: 'center' }}>
        Time left
      </Text>

      <Text
        style={{
          color: colors.appWhite,
          fontWeight: 'bold',
          width: 75,
          marginLeft: 5,
          textAlign: 'center',
        }}
      >
        {formatTimeLeft()}
      </Text>
    </View>
  );
};

export default LeaderboardTimeLeft;
