import {View, Dimensions, TouchableOpacity, Alert} from 'react-native';
import React, {
  MutableRefObject,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {PERCENTAGES} from '../../constants';
import colors from '../../constants/colors';
import {connect} from 'react-redux';
import {MyRootState, Sample} from '../../types/Shared';
import {getSamples} from '../../actions/profile';
import {getBMIItems, getSampleItems} from '../../helpers';
import Button from './Button';
import MetricExplained from './MetricExplained';
import Color from 'color';

const Chart: React.FC<{
  title: string;
  current?: number;
  suffix?: string;
  minY?: number;
  maxY?: number;
  ranges: number[];
  colors: string[];
  labels: string[];
  onPress?: () => void;
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
}) => {
  return (
    <View style={{alignItems: 'center'}}>
      <MetricExplained
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
      />
    </View>
  );
};

const ProfileCharts: React.FC<{
  weightSamples: Sample[];
  heightSamples: Sample[];
  bodyFatPercentageSamples: Sample[];
  muscleMassSamples: Sample[];
  boneMassSamples: Sample[];
  setShowBodyFatPercentageModal: (show: boolean) => void;
  setShowMuscleMassModal: (show: boolean) => void;
  setShowBoneMassModal: (show: boolean) => void;
  setShowWeightModal: (show: boolean) => void;
  setShowHeightModal: (show: boolean) => void;
  weight: number;
  height: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  boneMass?: number;
}> = ({
  weightSamples,
  heightSamples,
  bodyFatPercentageSamples,
  muscleMassSamples,
  boneMassSamples,
  setShowBodyFatPercentageModal,
  setShowBoneMassModal,
  setShowMuscleMassModal,
  weight,
  height,
  bodyFatPercentage,
  muscleMass,
  boneMass,
  setShowHeightModal,
  setShowWeightModal,
}) => {
  const [filter, setFilter] = useState<6 | 30 | 365>(6);
  const [showCharts, setShowCharts] = useState(true);

  const weightItems: {
    data: {x: number; y: number}[];
    lowest: number;
    highest: number;
  } = useMemo(() => {
    return getBMIItems(weight, height, weightSamples, heightSamples, filter);
  }, [weightSamples, weight, height, heightSamples, filter]);

  const bodyFatItems: {
    data: {x: number; y: number}[];
    lowest: number;
    highest: number;
  } = useMemo(() => {
    return getSampleItems(bodyFatPercentage, filter, bodyFatPercentageSamples);
  }, [bodyFatPercentageSamples, filter, bodyFatPercentage]);

  const muscleMassItems: {
    data: {x: number; y: number}[];
    lowest: number;
    highest: number;
  } = useMemo(() => {
    return getSampleItems(muscleMass, filter, muscleMassSamples);
  }, [muscleMassSamples, filter, muscleMass]);

  const boneMassItems: {
    data: {x: number; y: number}[];
    lowest: number;
    highest: number;
  } = useMemo(() => {
    return getSampleItems(boneMass, filter, boneMassSamples);
  }, [boneMassSamples, filter, boneMass]);

  const latestBMI = weightItems?.data[weightItems.data.length - 1]?.y;

  return (
    <>
      <Chart
        current={latestBMI}
        title="BMI"
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
          Alert.alert(
            'BMI',
            'Update your weight and height to determine your new BMI',
          )
        }
      />

      <Chart
        current={bodyFatPercentage}
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
        onPress={() => setShowBodyFatPercentageModal(true)}
      />
      <Chart
        current={muscleMass}
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
        onPress={() => setShowMuscleMassModal(true)}
        labels={['Low', 'Normal', 'High']}
      />
      <Chart
        current={boneMass}
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
        onPress={() => setShowBoneMassModal(true)}
        labels={['Below average', 'Average', 'Above average']}
      />
    </>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  weightSamples: profile.weightSamples,
  heightSamples: profile.heightSamples,
  bodyFatPercentageSamples: profile.bodyFatPercentageSamples,
  muscleMassSamples: profile.muscleMassSamples,
  boneMassSamples: profile.boneMassSamples,
});

export default connect(mapStateToProps)(ProfileCharts);
