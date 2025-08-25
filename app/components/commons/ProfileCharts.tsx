import Color from 'color';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { RootState } from '../../App';
import colors from '../../constants/colors';
import { getBMIItems, getBMRItems, getSampleItems } from '../../helpers';
import { Profile, Sample } from '../../types/Shared';
import MetricExplained from './MetricExplained';
import Modal from './Modal';
import ProfileGraph from './ProfileGraph';

const Chart: React.FC<{
  title: string;
  current?: number;
  suffix?: string;
  minY: number;
  maxY: number;
  ranges: number[];
  colors: string[];
  labels: string[];
  data: { x: Date; y: number }[];
  onPress?: () => void;
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
  connection,
  premium,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <View style={{ alignItems: 'center' }}>
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
        <ProfileGraph data={data} setShowModal={setShowModal} />
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
  metabolicAgeSamples: Sample[];
  setShowBodyFatPercentageModal?: (show: boolean) => void;
  setShowMuscleMassModal?: (show: boolean) => void;
  setShowBoneMassModal?: (show: boolean) => void;
  setShowVisceralFatModal?: (show: boolean) => void;
  setShowMetabolicAgeModal?: (show: boolean) => void;
  setShowWeightModal?: (show: boolean) => void;
  setShowHeightModal?: (show: boolean) => void;
  weight: number;
  height: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  boneMass?: number;
  connection?: boolean;
  visceralFat?: number;
  metabolicAge?: number;
  profile: Profile;
  filter: 6 | 30 | 365;
}> = ({
  weightSamples,
  heightSamples,
  bodyFatPercentageSamples,
  muscleMassSamples,
  boneMassSamples,
  visceralFatSamples,
  metabolicAgeSamples,
  setShowBodyFatPercentageModal,
  setShowBoneMassModal,
  setShowMuscleMassModal,
  setShowVisceralFatModal,
  setShowMetabolicAgeModal,
  weight,
  height,
  bodyFatPercentage,
  muscleMass,
  boneMass,
  connection,
  visceralFat,
  metabolicAge,
  profile,
  filter,
}) => {
  const bmiItems: {
    data: { x: Date; y: number }[];
    lowest: number;
    highest: number;
  } = useMemo(() => {
    return getBMIItems(weight, height, weightSamples, heightSamples, filter);
  }, [weightSamples, weight, height, heightSamples, filter]);

  const bodyFatItems: {
    data: { x: Date; y: number }[];
  } = useMemo(() => {
    return getSampleItems(bodyFatPercentage, filter, bodyFatPercentageSamples);
  }, [bodyFatPercentageSamples, filter, bodyFatPercentage]);

  const muscleMassItems: {
    data: { x: Date; y: number }[];
  } = useMemo(() => {
    return getSampleItems(muscleMass, filter, muscleMassSamples);
  }, [muscleMassSamples, filter, muscleMass]);

  const boneMassItems: {
    data: { x: Date; y: number }[];
  } = useMemo(() => {
    return getSampleItems(boneMass, filter, boneMassSamples);
  }, [boneMassSamples, filter, boneMass]);

  const visceralFatItems: {
    data: { x: Date; y: number }[];
  } = useMemo(() => {
    return getSampleItems(visceralFat, filter, visceralFatSamples);
  }, [filter, visceralFatSamples, visceralFat]);

  const bmrItems: {
    data: { x: Date; y: number }[];
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

  const metabolicAgeItems: {
    data: { x: Date; y: number }[];
  } = useMemo(() => {
    return getSampleItems(metabolicAge, filter, metabolicAgeSamples);
  }, [filter, metabolicAge, metabolicAgeSamples]);

  const latestBMI = bmiItems?.data[bmiItems.data.length - 1]?.y;
  const latestBMR = bmrItems?.data[bmrItems.data.length - 1]?.y;

  const age = moment().diff(profile.dob, 'years');

  return (
    <>
      <Chart
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
        connection={connection}
      />

      <Chart
        current={latestBMR}
        title="BMR"
        data={bmrItems.data}
        minY={1000}
        maxY={2000}
        ranges={[1200, 1400, 1600, 1800, 2000]}
        colors={[
          colors.appGreen,
          new Color(colors.appGreen).darken(0.5).toString(),
          new Color(colors.appGreen).darken(0.7).toString(),
          new Color(colors.appGreen).darken(0.8).toString(),
          new Color(colors.appGreen).darken(0.9).toString(),
        ]}
        labels={[]}
        connection={connection}
      />

      <Chart
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
        current={visceralFat}
        data={visceralFatItems.data}
        title="Visceral fat"
        minY={1}
        maxY={59}
        ranges={[12, 35]}
        colors={[
          new Color(colors.appGreen).darken(0.4).toString(),
          colors.secondaryLight,
          colors.appRed,
        ]}
        onPress={() => setShowVisceralFatModal && setShowVisceralFatModal(true)}
        labels={['Healthy', 'Excessive', 'High']}
        connection={connection}
        premium
      />
      <Chart
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
        onPress={() =>
          setShowMetabolicAgeModal && setShowMetabolicAgeModal(true)
        }
        labels={['', '', '']}
        connection={connection}
        premium
      />
    </>
  );
};

const mapStateToProps = ({ profile }: RootState) => ({
  weightSamples: profile.weightSamples,
  heightSamples: profile.heightSamples,
  bodyFatPercentageSamples: profile.bodyFatPercentageSamples,
  muscleMassSamples: profile.muscleMassSamples,
  boneMassSamples: profile.boneMassSamples,
  visceralFatSamples: profile.visceralFatSamples,
  metabolicAgeSamples: profile.metabolicAgeSamples,
  profile: profile.profile,
  filter: profile.filter,
});

export default connect(mapStateToProps)(ProfileCharts);
