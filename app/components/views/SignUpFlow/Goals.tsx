import {View} from 'react-native';
import React, {useState} from 'react';
import colors from '../../../constants/colors';
import {Goal, MyRootState} from '../../../types/Shared';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Text from '../../commons/Text';
import Dumbbell from '../../../images/dumbbell.svg';
import Time from '../../../images/time.svg';
import Fire from '../../../images/fire.svg';
import Button from '../../commons/Button';
import {connect} from 'react-redux';
import {SettingsState} from '../../../reducers/settings';
import {capitalizeFirstLetter} from '../../../helpers';
import Animated, {FadeIn} from 'react-native-reanimated';

const ICON_SIZE = 100;
const Goals: React.FC<{
  goal: Goal;
  settings: SettingsState;
}> = ({goal, settings}) => {
  const goalData = settings.workoutGoals[goal];
  const workoutGoal = goalData?.workouts.number;
  const minsGoal = goalData?.mins;
  const workoutLevelTitleString = capitalizeFirstLetter(
    goalData?.workouts.level || '',
  );
  const caloriesGoal = goalData?.calories || 0;
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
        Here are your weekly targets...
      </Text>
      <View style={{alignItems: 'center', marginVertical: 20}}>
        <Time />
        <Text
          style={{
            color: colors.appWhite,
            fontSize: 16,
            marginTop: 10,
            marginBottom: 40,
            textAlign: 'center',
          }}>
          {'Spend '}
          <Text style={{fontWeight: 'bold'}}>{minsGoal}</Text>
          {' minutes training'}
        </Text>
        <Icon
          name="gauge-high"
          size={25}
          color={colors.button}
          style={{
            marginHorizontal: 15,
          }}
        />
        <Text
          style={{
            color: colors.appWhite,
            fontSize: 16,
            marginTop: 10,
            marginBottom: 40,
            textAlign: 'center',
          }}>
          {'Complete '}
          <Text
            style={{
              fontWeight: 'bold',
            }}>{`${workoutGoal} `}</Text>
          {`${workoutLevelTitleString} workouts`}
        </Text>
        <Fire />
        <Text
          style={{
            color: colors.appWhite,
            fontSize: 16,
            marginTop: 10,
            marginBottom: 40,
            textAlign: 'center',
          }}>
          {'Burn '}
          <Text style={{fontWeight: 'bold'}}>{caloriesGoal}</Text>
          {' calories'}
        </Text>
      </View>
    </View>
  );
};

const mapStateToProps = ({settings}: MyRootState) => ({
  settings,
});

export default connect(mapStateToProps)(Goals);
