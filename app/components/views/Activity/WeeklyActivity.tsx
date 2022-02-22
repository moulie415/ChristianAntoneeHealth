import React, {useMemo} from 'react';
import {View, StyleSheet, Dimensions, ScrollView} from 'react-native';
import {Circle} from 'react-native-progress';
import moment from 'moment';
import {StackedBarChart, LineChart} from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../../constants/colors';
import styles from '../../../styles/views/Activity';
import {Divider, Layout, Text} from '@ui-kitten/components';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import WeeklyActivityProps from '../../../types/views/WeeklyActivity';
import {getWeightItems} from '../../../helpers';
import {weightChartConfig} from '../../../constants';
import DevicePixels from '../../../helpers/DevicePixels';

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
    <Layout style={{flex: 1}}>
      <ScrollView style={{flex: 1}}>
        <Text
          category="s1"
          style={{textAlign: 'center', marginVertical: DevicePixels[20]}}>
          Total Active Minutes
        </Text>
        <Circle
          strokeCap="round"
          style={{alignSelf: 'center'}}
          size={DevicePixels[200]}
          progress={0.7}
          thickness={10}
          color={colors.appBlue}
          borderWidth={0}
          unfilledColor={colors.appGrey}>
          <Layout
            style={{
              position: 'absolute',
              top: DevicePixels[70],
              left: DevicePixels[45],
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
                style={{marginRight: DevicePixels[5]}}
                size={DevicePixels[15]}
                color={colors.appBlue}
                name="arrow-down"
              />
              <Text>Goal: 4h 30m</Text>
            </Layout>
          </Layout>
        </Circle>
        <Text
          category="s1"
          style={{textAlign: 'center', margin: DevicePixels[20]}}>
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
          height={DevicePixels[220]}
          chartConfig={weightChartConfig}
          hideLegend
        />
        <Layout
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginBottom: DevicePixels[20],
          }}>
          <Layout
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Layout
              style={{
                height: DevicePixels[10],
                width: DevicePixels[10],
                borderRadius: DevicePixels[5],
                backgroundColor: colors.appLightBlue,
                marginRight: DevicePixels[5],
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
                height: DevicePixels[10],
                width: DevicePixels[10],
                borderRadius: DevicePixels[5],
                backgroundColor: colors.appBlue,
                marginRight: DevicePixels[5],
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
                height: DevicePixels[10],
                width: DevicePixels[10],
                borderRadius: DevicePixels[5],
                backgroundColor: colors.appGreen,
                marginRight: DevicePixels[5],
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
                height: DevicePixels[10],
                width: DevicePixels[10],
                borderRadius: DevicePixels[5],
                backgroundColor: colors.appRed,
                marginRight: DevicePixels[5],
              }}
            />
            <Text>Very Hard</Text>
          </Layout>
        </Layout>
        <Divider />
        <Text
          category="s1"
          style={{textAlign: 'center', marginVertical: DevicePixels[20]}}>
          Weight tracking
        </Text>
        <LineChart
          data={weightData}
          width={Dimensions.get('screen').width * 0.9}
          height={DevicePixels[220]}
          chartConfig={weightChartConfig}
          withVerticalLines={false}
          withShadow={false}
        />
      </ScrollView>
    </Layout>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  weightSamples: profile.weightSamples,
  stepSamples: profile.stepSamples,
  profile: profile.profile,
});

export default connect(mapStateToProps)(WeeklyActivity);
