import {Dimensions, View} from 'react-native';
import React from 'react';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import {StackedBarChart} from 'react-native-chart-kit';
import {Layout} from '@ui-kitten/components';
import {weightChartConfig} from '../../../constants';
import colors from '../../../constants/colors';

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

const ActivityBreakdown = () => {
  return (
    <View>
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
    </View>
  );
};

export default ActivityBreakdown;
