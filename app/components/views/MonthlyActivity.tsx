import React from 'react';
import {View, StyleSheet, Dimensions, ScrollView} from 'react-native';
import {Circle} from 'react-native-progress';
import {StackedBarChart, LineChart} from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import styles from '../../styles/views/Activity';
import {Divider, Text} from '@ui-kitten/components';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import MonthlyActivityProps from '../../types/views/MonthlyActivity';

const {width} = Dimensions.get('screen');
const circleSize = width * 0.268;

const data = {
  labels: ['J', 'F', 'M', 'A', 'M', 'J'],
  legend: ['easy', 'moderate', 'hard', 'very hard'],
  data: [
    [6.8, 4, 0, 0],
    [6.8, 6.4, 1.6, 0],
    [6.8, 4, 0, 0],
    [6.8, 7.2, 2.4, 0],
    [5.2, 5.2, 8, 1.2],
    [6.8, 0, 0, 0],
  ],
  barColors: [
    colors.appLightBlue,
    colors.appBlue,
    colors.appGreen,
    colors.appRed,
  ],
};

const weightData = {
  labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
      color: (opacity = 1) => colors.appBlue, // optional
      strokeWidth: 4, // optional
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: 'transparent',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: 'transparent',
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => '#fff',
  strokeWidth: 2, // optional, default 3
  useShadowColorFromDataset: false, // optional
  propsForBackgroundLines: {
    strokeWidth: 1,
  },
  barPercentage: 0.7,
};

const MonthlyActivity: React.FC<MonthlyActivityProps> = () => {
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
        <View
          style={{
            position: 'absolute',
            top: 70,
            left: 25,
          }}>
          <Text style={{textAlign: 'center'}} category="h2">
            52h 14m
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon
              style={{marginRight: 5}}
              size={15}
              color="#fff"
              name="arrow-down"
            />
            <Text>4h 30m last month</Text>
          </View>
        </View>
      </Circle>
      <View style={{flexDirection: 'row', marginVertical: 20}}>
        <View
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
            <View style={styles.circleSmallText}>
              <Icon
                name="shoe-prints"
                color="#fff"
                size={20}
                style={{marginBottom: 5}}
              />
              <Text>1 h 03 min</Text>
            </View>
          </Circle>
          <Text style={{textAlign: 'center'}}>4500 Kcal</Text>
        </View>
        <View
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
            <View style={styles.circleSmallText}>
              <Icon
                name="chart-area"
                color="#fff"
                size={20}
                style={{marginBottom: 5}}
              />
              <Text>1 h 03 min</Text>
            </View>
          </Circle>
          <Text style={{textAlign: 'center'}}>3700 Kcal</Text>
        </View>
        <View
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
            <View style={styles.circleSmallText}>
              <Icon
                name="stopwatch"
                color="#fff"
                size={20}
                style={{marginBottom: 5}}
              />
              <Text>1 h 03 min</Text>
            </View>
          </Circle>
          <Text style={{textAlign: 'center'}}>6500 Kcal</Text>
        </View>
      </View>
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
        chartConfig={chartConfig}
        hideLegend
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginBottom: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: colors.appLightBlue,
              marginRight: 5,
            }}
          />
          <Text>Easy</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: colors.appBlue,
              marginRight: 5,
            }}
          />
          <Text>Moderate</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: colors.appGreen,
              marginRight: 5,
            }}
          />
          <Text>Hard</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: colors.appRed,
              marginRight: 5,
            }}
          />
          <Text>Very Hard</Text>
        </View>
      </View>
      <Divider style={{backgroundColor: colors.borderColor}} />
      <Text category="s1" style={{textAlign: 'center', marginVertical: 20}}>
        Weight tracking
      </Text>
      <LineChart
        data={weightData}
        width={Dimensions.get('screen').width * 0.9}
        height={220}
        chartConfig={chartConfig}
        withVerticalLines={false}
      />
    </ScrollView>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  weightSamples: profile.weightSamples,
  stepSamples: profile.stepSamples,
});

export default connect(mapStateToProps)(MonthlyActivity);
