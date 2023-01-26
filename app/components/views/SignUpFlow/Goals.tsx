import {View} from 'react-native';
import React, {useState} from 'react';
import DevicePixels from '../../../helpers/DevicePixels';

import colors from '../../../constants/colors';
import {Goal} from '../../../types/Shared';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Text from '../../commons/Text';

const Goals: React.FC<{
  goal: Goal;
}> = ({goal}) => {
  const workoutGoal = goal === Goal.STRENGTH ? 4 : 3;
  const minsGoal = goal === Goal.WEIGHT_LOSS ? 180 : 150;
  const workoutLevelTitleString =
    goal === Goal.WEIGHT_LOSS
      ? 'Intermediate'
      : goal === Goal.STRENGTH
      ? 'Intermediate/advanced'
      : 'Beginner/intermediate';
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        margin: DevicePixels[50],
      }}>
      <Text
        style={{
          color: colors.appWhite,
          fontSize: DevicePixels[25],
          textAlign: 'center',
          marginBottom: DevicePixels[20],
        }}>
        Here's a summary of your weekly goals...
      </Text>
      <View style={{alignItems: 'center'}}>
        <Icon
          name="dumbbell"
          size={DevicePixels[40]}
          color={colors.appWhite}
          style={{
            marginHorizontal: DevicePixels[15],
          }}
        />
        <Text
          style={{
            color: colors.appWhite,
            fontSize: DevicePixels[20],
            marginTop: DevicePixels[10],
            marginBottom: DevicePixels[20],
            textAlign: 'center',
          }}>
          <Text style={{fontWeight: 'bold'}}>{workoutGoal}</Text>
          {' workouts completed'}
        </Text>
        <Icon
          name="stopwatch"
          size={DevicePixels[50]}
          color={colors.appWhite}
          style={{
            marginHorizontal: DevicePixels[15],
          }}
        />
        <Text
          style={{
            color: colors.appWhite,
            fontSize: DevicePixels[20],
            marginTop: DevicePixels[10],
            marginBottom: DevicePixels[20],
            textAlign: 'center',
          }}>
          <Text style={{fontWeight: 'bold'}}>{minsGoal}</Text>
          {' mins spent training'}
        </Text>

        <Icon
          name="tachometer-alt"
          size={DevicePixels[40]}
          color={colors.appWhite}
          style={{
            marginHorizontal: DevicePixels[15],
          }}
        />
        <Text
          style={{
            color: colors.appWhite,
            fontSize: DevicePixels[20],
            marginTop: DevicePixels[10],
            marginBottom: DevicePixels[20],
            textAlign: 'center',
          }}>
          <Text
            style={{
              fontWeight: 'bold',
            }}>{`${workoutGoal} `}</Text>
          {`${workoutLevelTitleString} workouts completed`}
        </Text>
        {goal === Goal.WEIGHT_LOSS && (
          <>
            <Icon
              name="fire-alt"
              size={DevicePixels[50]}
              color={colors.appWhite}
              style={{
                marginHorizontal: DevicePixels[15],
              }}
            />

            <Text
              style={{
                color: colors.appWhite,
                fontSize: DevicePixels[20],
                marginTop: DevicePixels[10],
                marginBottom: DevicePixels[20],
                textAlign: 'center',
              }}>
              <Text style={{fontWeight: 'bold'}}>{3500}</Text>
              {' calories burned'}
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

export default Goals;
