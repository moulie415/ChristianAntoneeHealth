import {SVGRenderer, SvgChart} from '@wuba/react-native-echarts';
import Color from 'color';
import {LineChart} from 'echarts/charts';
import {GridComponent} from 'echarts/components';
import * as echarts from 'echarts/core';
import moment from 'moment';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Alert, Dimensions, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import colors from '../../constants/colors';
import {getBMIItems, getBMRItems, getSampleItems} from '../../helpers';
import {MyRootState, Profile, Sample} from '../../types/Shared';
import Button from './Button';
import MetricExplained from './MetricExplained';
import Modal from './Modal';
import Text from './Text';

echarts.use([SVGRenderer, LineChart, GridComponent]);

const Graph: React.FC<{
  setShowModal: (show: boolean) => void;
  data: {x: Date; y: number}[];
  setFilter: (filter: 6 | 30 | 365) => void;
  filter: 6 | 30 | 365;
}> = ({setShowModal, data, setFilter, filter}) => {
  const svgRef = useRef<any>(null);
  useEffect(() => {
    const option = {
      xAxis: {
        type: 'category',
        data: data.map(({x}) =>
          moment(x).format(
            filter === 6 ? 'dd' : filter === 30 ? 'DD/MM' : 'MMM',
          ),
        ),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: data.map(d => d.y),
          type: 'line',
          lineStyle: {color: colors.appBlue},
          itemStyle: {color: colors.appBlue},
        },
      ],
    };
    let chart: any;
    if (svgRef.current) {
      chart = echarts.init(svgRef.current, 'light', {
        renderer: 'svg',
        width: Dimensions.get('window').width * 0.9,
        height: 300,
      });
      chart.setOption(option);
    }
    return () => chart?.dispose();
  }, [data, filter]);
  return (
    <View
      style={{
        width: '95%',
        backgroundColor: colors.appGrey,
        borderRadius: 15,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <TouchableOpacity style={{}} onPress={() => setFilter(6)}>
          <View
            style={{
              height: 40,
              paddingHorizontal: 20,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              backgroundColor: filter === 6 ? colors.appBlue : 'transparent',
              borderWidth: filter === 6 ? 0 : 1,
              borderColor: colors.borderColor,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: '#fff',
                textAlign: 'center',
              }}>
              1W
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{}} onPress={() => setFilter(30)}>
          <View
            style={{
              height: 40,
              paddingHorizontal: 20,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              backgroundColor: filter === 30 ? colors.appBlue : 'transparent',
              borderWidth: filter === 30 ? 0 : 1,
              borderColor: colors.borderColor,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: '#fff',
                textAlign: 'center',
              }}>
              1M
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{}} onPress={() => setFilter(365)}>
          <View
            style={{
              height: 40,
              paddingHorizontal: 20,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              backgroundColor: filter === 365 ? colors.appBlue : 'transparent',
              borderWidth: filter === 365 ? 0 : 1,
              borderColor: colors.borderColor,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: '#fff',
                textAlign: 'center',
              }}>
              1Y
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <SvgChart ref={svgRef} />
      <View style={{padding: 20}}>
        <Button text="Close" onPress={() => setShowModal(false)} />
      </View>
    </View>
  );
};

const Chart: React.FC<{
  title: string;
  current?: number;
  suffix?: string;
  minY: number;
  maxY: number;
  ranges: number[];
  colors: string[];
  labels: string[];
  data: {x: Date; y: number}[];
  onPress?: () => void;
  setFilter: (filter: 6 | 30 | 365) => void;
  filter: 6 | 30 | 365;
  connection?: boolean;
  premium?: boolean;
}> = ({
  title,
  current,
  minY,
  maxY,
  suffix,
  ranges,
  colors: colorsArr,
  labels,
  onPress,
  data,
  setFilter,
  filter,
  connection,
  premium,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <View style={{alignItems: 'center'}}>
        <MetricExplained
          connection={connection}
          onPressHistorical={() => setShowModal(true)}
          onPress={onPress}
          suffix={suffix}
          current={current}
          ranges={
            minY !== undefined && !!maxY && !!ranges
              ? [minY, ...ranges, maxY]
              : []
          }
          title={title}
          colors={colorsArr}
          labels={labels}
          premium={premium}
        />
      </View>
      <Modal visible={showModal} onRequestClose={() => setShowModal(false)}>
        <Graph
          setFilter={setFilter}
          filter={filter}
          data={data}
          setShowModal={setShowModal}
        />
      </Modal>
    </>
  );
};

const ProfileCharts: React.FC<{
  weightSamples: Sample[];
  heightSamples: Sample[];
  bodyFatPercentageSamples: Sample[];
  muscleMassSamples: Sample[];
  boneMassSamples: Sample[];
  visceralFatSamples: Sample[];
  setShowBodyFatPercentageModal?: (show: boolean) => void;
  setShowMuscleMassModal?: (show: boolean) => void;
  setShowBoneMassModal?: (show: boolean) => void;
  setShowVisceralFatModal?: (show: boolean) => void;
  setShowWeightModal?: (show: boolean) => void;
  setShowHeightModal?: (show: boolean) => void;
  weight: number;
  height: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  boneMass?: number;
  connection?: boolean;
  visceralFat?: number;
  profile: Profile;
}> = ({
  weightSamples,
  heightSamples,
  bodyFatPercentageSamples,
  muscleMassSamples,
  boneMassSamples,
  visceralFatSamples,
  setShowBodyFatPercentageModal,
  setShowBoneMassModal,
  setShowMuscleMassModal,
  setShowVisceralFatModal,
  weight,
  height,
  bodyFatPercentage,
  muscleMass,
  boneMass,
  connection,
  visceralFat,
  profile,
}) => {
  const [filter, setFilter] = useState<6 | 30 | 365>(6);

  const bmiItems: {
    data: {x: Date; y: number}[];
    lowest: number;
    highest: number;
  } = useMemo(() => {
    return getBMIItems(weight, height, weightSamples, heightSamples, filter);
  }, [weightSamples, weight, height, heightSamples, filter]);

  const bodyFatItems: {
    data: {x: Date; y: number}[];
    lowest: number;
    highest: number;
  } = useMemo(() => {
    return getSampleItems(bodyFatPercentage, filter, bodyFatPercentageSamples);
  }, [bodyFatPercentageSamples, filter, bodyFatPercentage]);

  const muscleMassItems: {
    data: {x: Date; y: number}[];
    lowest: number;
    highest: number;
  } = useMemo(() => {
    return getSampleItems(muscleMass, filter, muscleMassSamples);
  }, [muscleMassSamples, filter, muscleMass]);

  const boneMassItems: {
    data: {x: Date; y: number}[];
    lowest: number;
    highest: number;
  } = useMemo(() => {
    return getSampleItems(boneMass, filter, boneMassSamples);
  }, [boneMassSamples, filter, boneMass]);

  const visceralFatItems: {
    data: {x: Date; y: number}[];
    lowest: number;
    highest: number;
  } = useMemo(() => {
    return getSampleItems(visceralFat, filter, visceralFatSamples);
  }, [filter, visceralFatSamples, visceralFat]);

  const bmrItems: {
    data: {x: Date; y: number}[];
    lowest: number;
    highest: number;
  } = useMemo(() => {
    return getBMRItems(
      weight,
      height,
      weightSamples,
      heightSamples,
      filter,
      profile.gender,
      profile.dob,
    );
  }, [
    filter,
    height,
    heightSamples,
    profile.dob,
    profile.gender,
    weight,
    weightSamples,
  ]);

  // const metabolicAgeItems: {
  //   data: {x: Date; y: number}[];
  //   lowest: number;
  //   highest: number;
  // } = useMemo(() => {
  //   return getSampleItems(metabolicAge, filter, metabolicAgeSamples);
  // }, [filter, metabolicAge, metabolicAgeSamples]);

  const latestBMI = bmiItems?.data[bmiItems.data.length - 1]?.y;
  const latestBMR = bmrItems?.data[bmrItems.data.length - 1]?.y;

  const age = moment().diff(profile.dob, 'years');

  return (
    <>
      <Chart
        setFilter={setFilter}
        filter={filter}
        current={latestBMI}
        title="BMI"
        data={bmiItems.data}
        minY={0}
        maxY={40}
        ranges={[18.5, 25.0, 30.0]}
        colors={[
          colors.appBlueDark,
          colors.appGreen,
          colors.secondaryLight,
          colors.appRed,
        ]}
        labels={['Underweight', 'Normal', 'Overweight', 'Obesity']}
        onPress={() =>
          !connection &&
          Alert.alert(
            'Body mass index',
            'BMI is derived from your height and weight',
          )
        }
        connection={connection}
      />

      <Chart
        setFilter={setFilter}
        filter={filter}
        current={latestBMR}
        title="BMR"
        data={bmrItems.data}
        minY={1000}
        maxY={2000}
        ranges={[1200, 1400, 1600, 1800, 2000]}
        colors={[
          colors.appBlueDark,
          colors.appGreen,
          colors.appBlueLight,
          colors.muscleSecondary,
          colors.appRed,
        ]}
        labels={[]}
        onPress={() =>
          !connection &&
          Alert.alert(
            'Basal metabolic rate',
            'BMR is derived from your height, weight, sex and age',
          )
        }
        connection={connection}
      />

      <Chart
        setFilter={setFilter}
        filter={filter}
        current={bodyFatPercentage}
        data={bodyFatItems.data}
        title="Body fat percentage"
        minY={0}
        maxY={30}
        ranges={[6.0, 13.0, 17.0, 25.0]}
        colors={[
          colors.appBlueDark,
          colors.appGreen,
          colors.appBlueLight,
          colors.muscleSecondary,
          colors.appRed,
        ]}
        labels={[
          'Essential Fat',
          'Athletes',
          'Fitness',
          'Acceptable',
          'Obesity',
        ]}
        suffix="%"
        onPress={() =>
          setShowBodyFatPercentageModal && setShowBodyFatPercentageModal(true)
        }
        connection={connection}
        premium
      />
      <Chart
        setFilter={setFilter}
        filter={filter}
        current={muscleMass}
        data={muscleMassItems.data}
        minY={0}
        maxY={70}
        title="Muscle mass"
        suffix="kg"
        ranges={[44.0, 52.4]}
        colors={[
          colors.appBlueDark,
          colors.appGreen,
          new Color(colors.appGreen).darken(0.4).toString(),
        ]}
        onPress={() => setShowMuscleMassModal && setShowMuscleMassModal(true)}
        labels={['Low', 'Normal', 'High']}
        connection={connection}
        premium
      />
      <Chart
        setFilter={setFilter}
        filter={filter}
        current={boneMass}
        data={boneMassItems.data}
        title="Bone mass"
        suffix="kg"
        minY={0}
        maxY={10}
        ranges={[2.09, 3.48]}
        colors={[
          colors.secondaryLight,
          colors.appGreen,
          new Color(colors.appGreen).darken(0.4).toString(),
        ]}
        onPress={() => setShowBoneMassModal && setShowBoneMassModal(true)}
        labels={['Below average', 'Average', 'Above average']}
        connection={connection}
        premium
      />
      <Chart
        setFilter={setFilter}
        filter={filter}
        current={visceralFat}
        data={visceralFatItems.data}
        title="Visceral fat"
        minY={1}
        maxY={59}
        ranges={[12, 35]}
        colors={[
          new Color(colors.appGreen).darken(0.4).toString(),
          colors.appGreen,
          colors.secondaryLight,
        ]}
        onPress={() => setShowVisceralFatModal && setShowVisceralFatModal(true)}
        labels={['Low', 'Medium', 'High']}
        connection={connection}
        premium
      />
      {/* <Chart
        setFilter={setFilter}
        filter={filter}
        current={metabolicAge}
        data={metabolicAgeItems.data}
        title="Metabolic age"
        minY={1}
        maxY={100}
        ranges={[age - 3, age + 3]}
        colors={[
          new Color(colors.appGreen).darken(0.4).toString(),
          colors.appGreen,
          colors.secondaryLight,
        ]}
        onPress={() => setMetabolicAgeModal && setMetabolicAgeModal(true)}
        labels={['', '', '']}
        connection={connection}
        premium
      /> */}
    </>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  weightSamples: profile.weightSamples,
  heightSamples: profile.heightSamples,
  bodyFatPercentageSamples: profile.bodyFatPercentageSamples,
  muscleMassSamples: profile.muscleMassSamples,
  boneMassSamples: profile.boneMassSamples,
  visceralFatSamples: profile.visceralFatSamples,
  profile: profile.profile,
});

export default connect(mapStateToProps)(ProfileCharts);
