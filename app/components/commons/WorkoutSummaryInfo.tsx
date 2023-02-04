import {View} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';

import {getDifficultyEmoji} from '../../helpers/exercises';
import moment from 'moment';
import {rpeSliderScale} from './RPESlider';
import Text from './Text';

const WorkoutSummaryInfo: React.FC<{
  calories?: number;
  seconds: number;
  difficulty: number;
}> = ({
  calories,
  seconds,

  difficulty,
}) => {
  return (
    <>
      <Text
        style={{
          color: colors.appWhite,
          fontSize: 22,
          fontWeight: 'bold',
          textAlign: 'center',
          margin: 20,
        }}>
        Summary
      </Text>
      <View
        style={{
          justifyContent: 'space-evenly',
          flex: 1,
          alignItems: 'center',
        }}>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              marginBottom: 20,
              color: colors.appWhite,
              fontSize: 20,
            }}>
            Calories burned
          </Text>
          <Text
            style={{
              color: colors.appWhite,
              fontSize: 50,
              fontWeight: 'bold',
            }}>
            {Math.floor(calories || 0)}
          </Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              marginBottom: 20,
              color: colors.appWhite,
              fontSize: 20,
            }}>
            Time spent active
          </Text>
          <Text
            style={{
              color: colors.appWhite,
              fontSize: 40,
              fontWeight: 'bold',
            }}>
            {moment().utc().startOf('day').add({seconds}).format('mm:ss')}
          </Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={{color: colors.appWhite, fontSize: 20}}>RPE</Text>

          <Text
            style={{
              color: colors.appWhite,
              fontSize: 50,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {difficulty}
          </Text>
          <Text style={{fontSize: 70, color: colors.appWhite}}>
            {getDifficultyEmoji(difficulty)}
          </Text>
          <Text
            style={{
              color: colors.appWhite,
              fontSize: 25,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {`${rpeSliderScale[difficulty - 1].title}`}
          </Text>
        </View>
      </View>
    </>
  );
};

export default WorkoutSummaryInfo;
