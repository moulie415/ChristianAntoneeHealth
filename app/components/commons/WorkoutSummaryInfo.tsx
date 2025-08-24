import {FontAwesome6} from '@react-native-vector-icons/fontawesome6';
import Color from 'color';
import moment from 'moment';
import React from 'react';
import {ScrollView, View} from 'react-native';
import Animated, {FadeIn} from 'react-native-reanimated';
import colors from '../../constants/colors';
import Text from './Text';
import Tile from './Tile';

type Props = {
  children?: React.ReactNode;
  delay?: number;
};

const TILE_SIZE = 120;
const TILE_WIDTH = 230;

const SummaryTile: React.FC<Props> = ({children, delay = 500}) => {
  return (
    <Animated.View entering={FadeIn.duration(1000).delay(delay)}>
      <Tile
        style={{
          height: TILE_SIZE,
          width: TILE_WIDTH,
          alignSelf: 'center',
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
            <FontAwesome6
              iconStyle="solid"
              name="fire"
              color={colors.appBlue}
              style={{marginRight: 10}}
              size={30}
            />

            <Text
              style={{
                color: colors.appWhite,
                fontSize: 30,
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
          <FontAwesome6
            name="clock"
            color={colors.appBlue}
            style={{marginRight: 10}}
            size={30}
          />
          <Text
            style={{
              color: colors.appWhite,
              fontSize: 30,
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
          <FontAwesome6
            iconStyle="solid"
            name="droplet"
            color={colors.appBlue}
            style={{marginRight: 10}}
            size={30}
          />
          <Text
            style={{
              color: colors.appWhite,
              fontSize: 30,
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
            <FontAwesome6
              iconStyle="solid"
              name="heart-pulse"
              color={colors.appBlue}
              style={{marginRight: 10}}
              size={30}
            />
            <Text
              style={{
                color: colors.appWhite,
                fontSize: 30,
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
