import React, {useMemo} from 'react';
import {View, StyleSheet, Dimensions, ScrollView} from 'react-native';
import {Circle} from 'react-native-progress';
import moment from 'moment';
import {StackedBarChart, LineChart} from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import styles from '../../styles/views/Activity';
import {Divider, Layout, Text} from '@ui-kitten/components';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import WeeklyActivityProps from '../../types/views/WeeklyActivity';
import {getWeightItems} from '../../helpers';
import {weightChartConfig} from '../../constants';

const {width} = Dimensions.get('screen');
const circleSize = width * 0.268;

const data = {
  labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  legend: ['easy', 'moderate', 'hard', 'very hard'],
  data: [
    [1.7, 1, 0, 0],
    [1.7, 1.6, 0.4, 0],
    [1.7, 1, 0, 0],
    [1.7, 1.8, 0.7, 0],
    [1.3, 1.3, 2, 0.3],
    [1.7, 0, 0, 0],
    [1.3, 1, 2, 0.3],
  ],
  barColors: [
    colors.appLightBlue,
    colors.appBlue,
    colors.appGreen,
    colors.appRed,
  ],
};

const WeeklyActivity: React.FC<WeeklyActivityProps> = ({
  weightSamples,
  profile,
}) => {
  const monthlyWeightSamples = weightSamples[moment().month()];
  const weightItems: {
    labels: string[];
    data: number[];
    minMax: number[];
  } = useMemo(() => {
    return getWeightItems(profile, monthlyWeightSamples);
  }, [monthlyWeightSamples, profile]);

  const weightData = {
    labels: weightItems.labels,
    datasets: [
      {
        data: weightItems.data,
        color: (opacity = 1) => colors.appBlue, // optional
        strokeWidth: 4, // optional
      },
      {
        data: weightItems.minMax,
        color: () => 'rgba(0, 0, 0, 0)',
      },
    ],
  };

  return (
    <ScrollView style={{flex: 1}}>
      <Text category="s1" style={{textAlign: 'center', marginVertical: 20}}>
        Total Active Minutes
      </Text>
      <Circle
        strokeCap="round"
        style={{alignSelf: 'center'}}
        size={200}
        progress={0.7}
        thickness={10}
        color={colors.appBlue}
        borderWidth={0}
        unfilledColor={colors.appGrey}>
        <Layout
          style={{
            position: 'absolute',
            top: 70,
            left: 45,
          }}>
          <Text style={{textAlign: 'center'}} category="h2">
            3h 14m
          </Text>
          <Layout
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon
              style={{marginRight: 5}}
              size={15}
              color={colors.appBlue}
              name="arrow-down"
            />
            <Text>Goal: 4h 30m</Text>
          </Layout>
        </Layout>
      </Circle>
      <Layout style={{flexDirection: 'row', marginVertical: 20}}>
        <Layout
          style={{
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.borderColor,
            padding: 10,
            flex: 1,
            alignItems: 'center',
          }}>
          <Text style={{textAlign: 'center'}}>{'Walking \n'}</Text>
          <Circle
            strokeCap="round"
            style={{marginVertical: 10}}
            progress={0.7}
            thickness={7}
            color={colors.appRed}
            borderWidth={0}
            size={circleSize}
            unfilledColor={colors.appGrey}>
            <Layout style={styles.circleSmallText}>
              <Icon
                name="shoe-prints"
                color={colors.appBlue}
                size={20}
                style={{marginBottom: 5}}
              />
              <Text>1 h 03 min</Text>
            </Layout>
          </Circle>
          <Text style={{textAlign: 'center'}}>4500 Kcal</Text>
        </Layout>
        <Layout
          style={{
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.borderColor,
            padding: 10,
            flex: 1,
          }}>
          <Text style={{textAlign: 'center'}}>Daily Living Activity</Text>
          <Circle
            strokeCap="round"
            style={{marginVertical: 10}}
            progress={0.7}
            thickness={7}
            color={colors.appLightBlue}
            borderWidth={0}
            size={circleSize}
            unfilledColor={colors.appGrey}>
            <Layout style={styles.circleSmallText}>
              <Icon
                name="chart-area"
                color={colors.appBlue}
                size={20}
                style={{marginBottom: 5}}
              />
              <Text>1 h 03 min</Text>
            </Layout>
          </Circle>
          <Text style={{textAlign: 'center'}}>3700 Kcal</Text>
        </Layout>
        <Layout
          style={{
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.borderColor,
            padding: 10,
            flex: 1,
          }}>
          <Text style={{textAlign: 'center'}}>Workout Activity</Text>
          <Circle
            strokeCap="round"
            style={{marginVertical: 10}}
            progress={0.7}
            thickness={7}
            color={colors.appGreen}
            borderWidth={0}
            size={circleSize}
            unfilledColor={colors.appGrey}>
            <Layout style={styles.circleSmallText}>
              <Icon
                name="stopwatch"
                color={colors.appBlue}
                size={20}
                style={{marginBottom: 5}}
              />
              <Text>1 h 03 min</Text>
            </Layout>
          </Circle>
          <Text style={{textAlign: 'center'}}>6500 Kcal</Text>
        </Layout>
      </Layout>
      <Text category="s1" style={{textAlign: 'center', marginBottom: 20}}>
        Activity breakdown per day
      </Text>
      <StackedBarChart
        yAxisSuffix="hrs"
        decimalPlaces={1}
        yAxisInterval={2}
        segments={2}
        data={data}
        width={Dimensions.get('screen').width * 0.9}
        style={{alignSelf: 'center'}}
        height={220}
        chartConfig={weightChartConfig}
        hideLegend
      />
      <Layout
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginBottom: 20,
        }}>
        <Layout
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Layout
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: colors.appLightBlue,
              marginRight: 5,
            }}
          />
          <Text>Easy</Text>
        </Layout>
        <Layout
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Layout
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: colors.appBlue,
              marginRight: 5,
            }}
          />
          <Text>Moderate</Text>
        </Layout>
        <Layout
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Layout
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: colors.appGreen,
              marginRight: 5,
            }}
          />
          <Text>Hard</Text>
        </Layout>
        <Layout
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Layout
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: colors.appRed,
              marginRight: 5,
            }}
          />
          <Text>Very Hard</Text>
        </Layout>
      </Layout>
      <Divider style={{backgroundColor: colors.borderColor}} />
      <Text category="s1" style={{textAlign: 'center', marginVertical: 20}}>
        Weight tracking
      </Text>
      <LineChart
        data={weightData}
        width={Dimensions.get('screen').width * 0.9}
        height={220}
        chartConfig={weightChartConfig}
        withVerticalLines={false}
        withShadow={false}
      />
    </ScrollView>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  weightSamples: profile.weightSamples,
  stepSamples: profile.stepSamples,
  profile: profile.profile,
});

export default connect(mapStateToProps)(WeeklyActivity);
