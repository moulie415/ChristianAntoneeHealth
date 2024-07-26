import {RouteProp} from '@react-navigation/native';
import {SvgChart, SVGRenderer} from '@wuba/react-native-echarts';
import {LineChart} from 'echarts/charts';
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import {ECBasicOption} from 'echarts/types/dist/shared';
import moment from 'moment';
import React, {useEffect, useMemo, useRef} from 'react';
import {Dimensions, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import Header from '../../commons/Header';
import Text from '../../commons/Text';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  SVGRenderer,
  LineChart,
  LegendComponent,
  MarkLineComponent,
  DataZoomComponent,
]);

const E_HEIGHT = 350;

interface LegendItem {
  color: string;
  label: string;
  items: any[];
}

const WorkoutBreakdown: React.FC<{
  route: RouteProp<StackParamList, 'WorkoutBreakdown'>;
}> = ({route}) => {
  const chartRef = useRef<typeof SvgChart>(null);
  const {workout} = route.params;

  // Calculate cumulative calories
  const cumulativeCalories = useMemo(
    () =>
      workout.calorieSamples?.reduce(
        (acc: {startDate: string; value: number}[], sample, index) => {
          const previousValue = index === 0 ? 0 : acc[index - 1].value;
          const cumulativeValue = previousValue + sample.value;
          return [
            ...acc,
            {
              startDate: sample.startDate,
              value: cumulativeValue,
            },
          ];
        },
        [],
      ) || [],
    [workout.calorieSamples],
  );

  // Convert events into mark lines
  const exerciseEventLines = workout.exerciseEvents?.map(event => ({
    name: 'Next exercise',
    xAxis:
      'toDate' in event.time
        ? event.time.toDate().getTime()
        : event.time.getTime(), // Ensure the time is in milliseconds
    lineStyle: {
      color: colors.appBlue,
      type: 'solid', // Make the line solid
    },
  }));

  const pauseEventLines = workout.pauseEvents
    ?.filter(event => event.paused)
    .map(event => ({
      name: 'Pause events',
      xAxis:
        'toDate' in event.time
          ? event.time.toDate().getTime()
          : event.time.getTime(), // Ensure the time is in milliseconds
      lineStyle: {
        color: colors.appWhite,
        type: 'solid', // Make the line solid
      },
    }));

  const resumeEventLines = workout.pauseEvents
    ?.filter(event => !event.paused)
    .map(event => ({
      name: 'Resume events',
      xAxis:
        'toDate' in event.time
          ? event.time.toDate().getTime()
          : event.time.getTime(), // Ensure the time is in milliseconds
      lineStyle: {
        color: colors.appGreen,
        type: 'solid', // Make the line solid
      },
    }));

  const option: ECBasicOption = useMemo(() => {
    return {
      xAxis: {
        type: 'time',
        axisLabel: {
          formatter: function (value: string) {
            return moment(value).format('HH:mm');
          },
          rotate: 45,
          showMaxLabel: true,
        },
        axisLine: {
          onZero: false,
        },
        axisTick: {
          alignWithLabel: true,
        },
        boundaryGap: false,
      },
      yAxis: [
        {
          type: 'value',
        },
        {
          type: 'value',
          axisLabel: {
            formatter: function (value: number) {
              return Math.round(value);
            },
          },
        },
      ],
      series: [
        {
          name: 'Heart Rate',
          data: workout.heartRateSamples.map(sample => ({
            value: [sample.startDate, sample.value],
          })),
          type: 'line',
          lineStyle: {
            color: colors.appRed,
          },
          itemStyle: {
            color: colors.appRed,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: colors.appRed, // Top color
                },
                {
                  offset: 1,
                  color: 'rgba(255, 0, 0, 0)', // Bottom color
                },
              ],
            },
          },
          yAxisIndex: 0,
          z: 10, // Make sure this series is above the mark lines
        },
        {
          name: 'Calories',
          data: cumulativeCalories.map(sample => ({
            value: [sample.startDate, sample.value],
          })),
          type: 'line',
          lineStyle: {
            color: colors.secondaryDark,
          },
          itemStyle: {
            color: colors.secondaryDark,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: colors.secondaryDark, // Top color
                },
                {
                  offset: 1,
                  color: 'rgba(255, 165, 0, 0)', // Bottom color
                },
              ],
            },
          },
          yAxisIndex: 1,
          z: 10, // Make sure this series is above the mark lines
        },
        {
          name: 'New exercise',
          type: 'line',
          data: [], // This series doesn't need data; lines are added as markLines
          markLine: {
            data: exerciseEventLines,
            symbol: 'none',
            label: {
              show: false,
            },
          },
          z: 1, // Ensure this is below other series
        },
        {
          name: 'Pause events',
          type: 'line',
          data: [], // This series doesn't need data; lines are added as markLines
          markLine: {
            data: pauseEventLines,
            symbol: 'none',
            label: {
              show: false,
            },
          },
          z: 1, // Ensure this is below other series
        },
        {
          name: 'Resume events',
          type: 'line',
          data: [], // This series doesn't need data; lines are added as markLines
          markLine: {
            data: resumeEventLines,
            symbol: 'none',
            label: {
              show: false,
            },
          },
          z: 1, // Ensure this is below other series
        },
      ],
      tooltip: {
        trigger: 'axis',
        formatter: function (params: any) {
          let tooltipContent = '';
          params.forEach((param: any) => {
            const date = moment(param.value[0]).format('HH:mm:ss');
            tooltipContent += `${param.seriesName} at ${date}: ${Math.round(
              param.value[1],
            )}\n`;
          });
          return tooltipContent;
        },
      },
    };
  }, [
    workout,
    cumulativeCalories,
    exerciseEventLines,
    pauseEventLines,
    resumeEventLines,
  ]);

  useEffect(() => {
    let chart: echarts.ECharts;
    if (chartRef.current) {
      chart = echarts.init(chartRef.current, 'light', {
        renderer: 'svg',
        width: Dimensions.get('window').width,
        height: E_HEIGHT,
      });
      chart.setOption(option);
    }
    return () => chart?.dispose();
  }, [option]);

  const legendItems: LegendItem[] = [
    {
      color: colors.appRed,
      label: 'Heart rate',
      items: workout.heartRateSamples,
    },
    {
      color: colors.secondaryDark,
      label: 'Calories',
      items: workout.calorieSamples,
    },
    {
      color: colors.appBlue,
      label: 'Next exercise',
      items: workout.exerciseEvents,
    },
    {color: colors.appWhite, label: 'Pause events', items: pauseEventLines},
    {color: colors.appGreen, label: 'Resume events', items: resumeEventLines},
  ];

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.appGrey}}>
      <Header hasBack title="Workout Breakdown" />
      <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
        <SvgChart ref={chartRef} />
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 5,
            justifyContent: 'space-evenly',
            flexWrap: 'wrap',
          }}>
          {legendItems
            .filter(({items}) => items.length)
            .map(item => (
              <View
                key={item.label}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: item.color,
                  }}
                />

                <Text style={{color: colors.appWhite, marginHorizontal: 10}}>
                  {item.label}
                </Text>
              </View>
            ))}
        </View>
        
      </View>
    </SafeAreaView>
  );
};

export default WorkoutBreakdown;
