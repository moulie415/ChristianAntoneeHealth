import {View, ScrollView} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';

import {getDifficultyEmoji} from '../../helpers/exercises';
import moment from 'moment';
import {rpeSliderScale} from './RPESlider';
import Text from './Text';

type Props = {
  children?: React.ReactNode;
};

const TILE_SIZE = 130;

const Tile: React.FC<Props> = ({children}) => {
  return (
    <View>
      <View
        style={{
          height: TILE_SIZE,
          width: TILE_SIZE,
          borderRadius: 15,
          overflow: 'hidden',
          padding: 10,
          backgroundColor: 'rgba(42, 93, 194, 0.6)',
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: colors.appWhite,
          borderWidth: 2,
        }}>
        {children}
      </View>
    </View>
  );
};

const WorkoutSummaryInfo: React.FC<{
  calories?: number;
  seconds: number;
  difficulty: number;
  averageHeartRate: number;
}> = ({calories, seconds, averageHeartRate, difficulty}) => {
  return (
    <ScrollView contentContainerStyle={{flex: 1}}>
      <Text
        style={{
          color: colors.appWhite,
          fontSize: 22,
          fontWeight: 'bold',
          textAlign: 'center',
          margin: 20,
        }}>
        Workout Summary
      </Text>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <Tile>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: 20,
                  textAlign: 'center',
                }}>
                Calories burned
              </Text>
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: 40,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {Math.floor(calories || 0)}
              </Text>
            </View>
          </Tile>
          <Tile>
            <Text
              style={{
                color: colors.appWhite,
                fontSize: 20,
                textAlign: 'center',
              }}>
              Workout duration
            </Text>
            <Text
              style={{
                color: colors.appWhite,
                fontSize: 30,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {moment().utc().startOf('day').add({seconds}).format('mm:ss')}
            </Text>
          </Tile>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: 40,
          }}>
          <Tile>
            <Text style={{color: colors.appWhite, fontSize: 20}}>RPE</Text>
            <Text
              style={{
                color: colors.appWhite,
                fontSize: 30,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {difficulty}
            </Text>
            <Text style={{fontSize: 30, color: colors.appWhite}}>
              {getDifficultyEmoji(difficulty)}
            </Text>
          </Tile>
          <Tile>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: 20,
                  textAlign: 'center',
                }}>
                Average heart rate
              </Text>
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: 40,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {averageHeartRate ? Math.floor(averageHeartRate || 0) : 'N/A'}
              </Text>
            </View>
          </Tile>
        </View>
      </View>
    </ScrollView>
  );
};

export default WorkoutSummaryInfo;
