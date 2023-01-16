import {View} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import DevicePixels from '../../helpers/DevicePixels';
import {getDifficultyEmoji} from '../../helpers/exercises';
import moment from 'moment';
import {rpeSliderScale} from './RPESlider';
import Text from './Text';

const WorkoutSummaryInfo: React.FC<{
  calories: number;
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
          fontSize: DevicePixels[22],
          fontWeight: 'bold',
          textAlign: 'center',
          margin: DevicePixels[20],
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
              marginBottom: DevicePixels[20],
              color: colors.appWhite,
              fontSize: DevicePixels[20],
            }}>
            Calories burned
          </Text>
          <Text
            style={{
              color: colors.appWhite,
              fontSize: DevicePixels[50],
              fontWeight: 'bold',
            }}>
            {Math.floor(calories)}
          </Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              marginBottom: DevicePixels[20],
              color: colors.appWhite,
              fontSize: DevicePixels[20],
            }}>
            Time spent active
          </Text>
          <Text
            style={{
              color: colors.appWhite,
              fontSize: DevicePixels[40],
              fontWeight: 'bold',
            }}>
            {moment().utc().startOf('day').add({seconds}).format('mm:ss')}
          </Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={{color: colors.appWhite, fontSize: DevicePixels[20]}}>
            RPE
          </Text>

          <Text
            style={{
              color: colors.appWhite,
              fontSize: DevicePixels[50],
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {difficulty}
          </Text>
          <Text style={{fontSize: DevicePixels[70], color: colors.appWhite}}>
            {getDifficultyEmoji(difficulty)}
          </Text>
          <Text
            style={{
              color: colors.appWhite,
              fontSize: DevicePixels[25],
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
