import {View} from 'react-native';
import React, {useState} from 'react';

import colors from '../../../constants/colors';
import {Goal} from '../../../types/Shared';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Text from '../../commons/Text';
import Dumbbell from '../../../images/dumbbell.svg';
import DumbbellRed from '../../../images/dumbbell_red.svg';
import Time from '../../../images/time.svg';
import Fire from '../../../images/fire.svg';

const ICON_SIZE = 100;
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
        margin: 50,
      }}>
      <Text
        style={{
          color: colors.appWhite,
          fontSize: 25,
          textAlign: 'center',
          marginBottom: 20,
        }}>
        Here's a summary of your weekly goals...
      </Text>
      <View style={{alignItems: 'center'}}>
        <Dumbbell />
        <Text
          style={{
            color: colors.appWhite,
            fontSize: 20,
            marginTop: 10,
            marginBottom: 20,
            textAlign: 'center',
          }}>
          <Text style={{fontWeight: 'bold'}}>{workoutGoal}</Text>
          {' workouts completed'}
        </Text>
        <Time />
        <Text
          style={{
            color: colors.appWhite,
            fontSize: 20,
            marginTop: 10,
            marginBottom: 20,
            textAlign: 'center',
          }}>
          <Text style={{fontWeight: 'bold'}}>{minsGoal}</Text>
          {' mins spent training'}
        </Text>

        <DumbbellRed />
        <Text
          style={{
            color: colors.appWhite,
            fontSize: 20,
            marginTop: 10,
            marginBottom: 20,
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
            <Fire />

            <Text
              style={{
                color: colors.appWhite,
                fontSize: 20,
                marginTop: 10,
                marginBottom: 20,
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
