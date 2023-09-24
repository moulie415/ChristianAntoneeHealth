import {View, ScrollView} from 'react-native';
import React, {useEffect} from 'react';
import colors from '../../constants/colors';
import {getDifficultyEmoji} from '../../helpers/exercises';
import moment from 'moment';
import {rpeSliderScale} from './RPESlider';
import Text from './Text';
import Tile from './Tile';
import Animated, {FadeIn} from 'react-native-reanimated';
import Fire from '../../images/fire.svg';
import Time from '../../images/time.svg';
import {FONTS_SIZES} from '../../constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Color from 'color';
import {navigationRef} from '../../RootNavigation';

type Props = {
  children?: React.ReactNode;
  delay?: number;
};

const TILE_SIZE = 130;

const SummaryTile: React.FC<Props> = ({children, delay = 500}) => {
  return (
    <Animated.View entering={FadeIn.duration(1000).delay(delay)}>
      <Tile
        style={{
          height: TILE_SIZE,
          alignSelf: 'center',
          width: 250,
          marginBottom: 20,
          padding: 10,

          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {children}
      </Tile>
    </Animated.View>
  );
};

const WorkoutSummaryInfo: React.FC<{
  calories?: number;
  seconds: number;
  difficulty: number;
  averageHeartRate: number;
}> = ({calories, seconds, averageHeartRate, difficulty}) => {
  return (
    <ScrollView style={{flex: 1}}>
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

      <SummaryTile>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              color: Color(colors.appWhite).darken(0.3).hex(),
              fontSize: 20,
              textAlign: 'center',
            }}>
            Calories burned
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon
              name="fire"
              color={colors.appBlue}
              style={{marginRight: 10}}
              size={30}
            />

            <Text
              style={{
                color: colors.appWhite,
                fontSize: 35,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {`${Math.floor(calories || 0)} kcal`}
            </Text>
          </View>
        </View>
      </SummaryTile>

      <SummaryTile delay={1000}>
        <Text
          style={{
            fontSize: 20,
            textAlign: 'center',
            color: Color(colors.appWhite).darken(0.3).hex(),
          }}>
          Workout duration
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon
            name="clock"
            color={colors.appBlue}
            style={{marginRight: 10}}
            size={30}
          />
          <Text
            style={{
              color: colors.appWhite,
              fontSize: 35,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {moment().utc().startOf('day').add({seconds}).format('mm:ss')}
          </Text>
        </View>
      </SummaryTile>

      <SummaryTile delay={1500}>
        <Text
          style={{
            color: Color(colors.appWhite).darken(0.3).hex(),
            fontSize: 20,
          }}>
          Intensity
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="tint"
            color={colors.appBlue}
            style={{marginRight: 10}}
            size={30}
          />
          <Text
            style={{
              color: colors.appWhite,
              fontSize: 35,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {`${difficulty}/10`}
          </Text>
        </View>
      </SummaryTile>

      <SummaryTile delay={2000}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              color: Color(colors.appWhite).darken(0.3).hex(),
            }}>
            Average heart rate
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="heartbeat"
              color={colors.appBlue}
              style={{marginRight: 10}}
              size={30}
            />
            <Text
              style={{
                color: colors.appWhite,
                fontSize: 35,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {averageHeartRate
                ? `${Math.floor(averageHeartRate || 0)} bpm`
                : 'N/A'}
            </Text>
          </View>
        </View>
      </SummaryTile>
    </ScrollView>
  );
};

export default WorkoutSummaryInfo;
