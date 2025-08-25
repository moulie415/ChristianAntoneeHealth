import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Text, View } from 'react-native';
import colors from '../../../constants/colors';
import { LeaderboardItem } from '../../../types/Shared';
import Avatar from '../../commons/Avatar';

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return '#DAA520';
    case 2:
      return '#71706e';
    default:
      return '#804A00';
  }
};

const PodiumItem: React.FC<{ item?: LeaderboardItem; suffix?: string }> = ({
  item,
  suffix,
}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        paddingTop: item?.rank !== 1 ? 65 : 0,
        width: '33%',
      }}
    >
      {item && (
        <>
          <View>
            {item.rank === 1 && (
              <FontAwesome6
                iconStyle="solid"
                name="crown"
                style={{ alignSelf: 'center' }}
                size={25}
                color={getRankColor(1)}
              />
            )}
            <Avatar
              size={item.rank === 1 ? 60 : 50}
              src={item.user?.avatar}
              name={`${item?.user?.name || ''} ${item?.user?.surname || ''}`}
              style={{ borderWidth: 4, borderColor: getRankColor(item.rank) }}
              uid={item.userId}
            />

            <View
              style={{
                position: 'absolute',
                alignSelf: 'center',
                alignItems: 'center',
                bottom: -10,
                left: 0,
                right: 0,
              }}
            >
              <View
                style={{
                  backgroundColor: getRankColor(item.rank),
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: colors.appWhite,
                    lineHeight: 20,
                    textAlign: 'center',
                  }}
                >
                  {item.rank}
                </Text>
              </View>
            </View>
          </View>
          <Text
            style={{
              color: colors.appWhite,
              marginTop: 20,
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            {`${item?.user?.name || ''} ${item?.user?.surname || ''}`}
          </Text>
          <Text
            style={{
              color: colors.appWhite,
              fontWeight: 'bold',
              marginTop: 5,
            }}
          >
            {`${item.score} ${suffix || ''}`}
          </Text>
        </>
      )}
    </View>
  );
};

export default PodiumItem;
