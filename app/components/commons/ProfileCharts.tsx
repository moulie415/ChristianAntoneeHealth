import {
  View,
  ScrollView,
  Dimensions,
  Linking,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';
import React, {ReactNode, useEffect, useMemo, useState} from 'react';
import DevicePixels from '../../helpers/DevicePixels';
import {PERCENTAGES} from '../../constants';
import colors from '../../constants/colors';
import {connect} from 'react-redux';
import {MyRootState, Sample} from '../../types/Shared';
import {getSamples} from '../../actions/profile';
import {getBMIItems, getSampleItems} from '../../helpers';
import LinearGradient from 'react-native-linear-gradient';
import Text from './Text';
import Button from './Button';
import Spinner from './Spinner';
import {
  VictoryArea,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLine,
} from 'victory-native';
import moment from 'moment';
import MetricExplainedModal from './MetricExplainedModal';

const Chart: React.FC<{
  data: {x: number; y: number}[];
  title: string;
  lowest: number;
  highest: number;
  filter: 6 | 30 | 365;
  capitalize?: boolean;
  current: number;
  suffix?: string;
  footer?: ReactNode;
  minY?: number;
  maxY?: number;
  ranges: number[];
  colors: string[];
  labels: string[];
}> = ({
  data,
  title,
  footer,
  lowest,
  highest,
  filter,
  current,
  capitalize,
  minY,
  maxY,
  suffix,
  ranges,
  colors: colorsArr,
  labels,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View>
      <Text
        style={{
          margin: DevicePixels[20],
          color: colors.appWhite,
          fontWeight: 'bold',
          fontSize: DevicePixels[24],
          marginBottom: 0,
        }}>
        {title}
      </Text>
      <VictoryChart
        maxDomain={{
          y: maxY !== undefined && maxY > highest + 5 ? maxY : highest + 5,
        }}
        minDomain={{y: minY !== undefined ? minY : lowest - 5}}
        width={Dimensions.get('window').width * 0.9}
        height={DevicePixels[250]}
        theme={VictoryTheme.material}>
        <VictoryArea style={{data: {fill: colors.appBlue}}} data={data} />
        {/* <VictoryLine style={{data: {fill: colors.appBlue}}} data={data} /> */}

        <VictoryAxis
          offsetY={DevicePixels[50]}
          tickFormat={x => {
            if (filter === 6) {
              return moment(x).format('dd');
            }
            if (filter === 30) {
              return moment(x).format('Do');
            }
            if (filter === 365) {
              return moment(x).format('MMM');
            }
          }}
        />
        <VictoryAxis dependentAxis tickFormat={x => `${x} ${suffix || ''}`} />
      </VictoryChart>
      <View style={{marginLeft: DevicePixels[20]}}>
        {current !== undefined && (
          <Text
            style={{
              color: colors.appWhite,
              fontSize: DevicePixels[16],
              marginHorizontal: DevicePixels[20],
              marginVertical: DevicePixels[10],
            }}>
            Your current{' '}
            {capitalize ? title.toUpperCase() : title.toLowerCase()} is{' '}
            <Text style={{fontWeight: 'bold'}}>{current}</Text>
          </Text>
        )}

        {current !== undefined && (
          <Text
            onPress={() => setModalVisible(true)}
            style={{
              color: colors.appWhite,
              fontWeight: 'bold',
              textDecorationLine: 'underline',
              marginHorizontal: DevicePixels[20],
              marginBottom: DevicePixels[20],
            }}>
            What does this mean?
          </Text>
        )}
      </View>
      {footer}

      <MetricExplainedModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        suffix={suffix}
        current={current}
        ranges={[minY, ...ranges, maxY]}
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
  boneDensitySamples: Sample[];
  getSamplesAction: () => void;
  setShowBodyFatPercentageModal: (show: boolean) => void;
  setShowMuscleMassModal: (show: boolean) => void;
  setShowBoneDensityModal: (show: boolean) => void;
  setShowWeightModal: (show: boolean) => void;
  setShowHeightModal: (show: boolean) => void;
  weight: number;
  height: number;
  bodyFatPercentage: number;
  muscleMass: number;
  boneDensity: number;
}> = ({
  weightSamples,
  heightSamples,
  bodyFatPercentageSamples,
  muscleMassSamples,
  boneDensitySamples,
  getSamplesAction,
  setShowBodyFatPercentageModal,
  setShowBoneDensityModal,
  setShowMuscleMassModal,
  weight,
  height,
  bodyFatPercentage,
  muscleMass,
  boneDensity,
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

  const boneDensityItems: {
    data: {x: number; y: number}[];
    lowest: number;
    highest: number;
  } = useMemo(() => {
    return getSampleItems(boneDensity, filter, boneDensitySamples);
  }, [boneDensitySamples, filter, boneDensity]);

  useEffect(() => {
    const init = async () => {
      // if (await isEnabled()) {
      getSamplesAction();
      // InteractionManager.runAfterInteractions(() => {
      //   setShowCharts(true);
      // });
      // }
    };
    init();
  }, [getSamplesAction]);

  const latestBMI = weightItems?.data[weightItems.data.length - 1]?.y;
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          marginTop: DevicePixels[30],
        }}>
        <TouchableOpacity style={{}} onPress={() => setFilter(6)}>
          <LinearGradient
            colors={
              filter === 6
                ? [colors.appBlueLight, colors.appBlueDark]
                : ['transparent', 'transparent']
            }
            style={{
              height: DevicePixels[40],
              paddingHorizontal: DevicePixels[10],
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: DevicePixels[25],
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: '#fff',
                textAlign: 'center',
              }}>
              Weekly
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={{}} onPress={() => setFilter(30)}>
          <LinearGradient
            colors={
              filter === 30
                ? [colors.appBlueLight, colors.appBlueDark]
                : ['transparent', 'transparent']
            }
            style={{
              height: DevicePixels[40],
              paddingHorizontal: DevicePixels[10],
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: DevicePixels[25],
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: '#fff',
                textAlign: 'center',
              }}>
              Monthly
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={{}} onPress={() => setFilter(365)}>
          <LinearGradient
            colors={
              filter === 365
                ? [colors.appBlueLight, colors.appBlueDark]
                : ['transparent', 'transparent']
            }
            style={{
              height: DevicePixels[40],
              paddingHorizontal: DevicePixels[10],
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: DevicePixels[25],
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: '#fff',
                textAlign: 'center',
              }}>
              Yearly
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      {showCharts ? (
        <ScrollView horizontal>
          <Chart
            current={latestBMI}
            filter={filter}
            title="BMI"
            data={weightItems.data}
            lowest={weightItems.lowest}
            highest={weightItems.highest}
            minY={0}
            maxY={40}
            capitalize
            ranges={[18.5, 25.0, 30.0]}
            colors={[
              colors.appBlueDark,
              colors.appGreen,
              colors.secondaryLight,
              colors.appRed,
            ]}
            labels={['Underweight', 'Normal', 'Overweight', 'Obesity']}
            footer={
              <View
                style={{
                  flexDirection: 'row',
                  width: Dimensions.get('window').width,
                  justifyContent: 'space-evenly',
                }}>
                <Button
                  onPress={() => setShowWeightModal(true)}
                  text="Enter weight"
                  style={{
                    width: '42%',
                    marginTop: DevicePixels[10],
                  }}
                />
                <Button
                  onPress={() => setShowHeightModal(true)}
                  text="Enter height"
                  style={{
                    width: '42%',
                    marginTop: DevicePixels[10],
                  }}
                />
              </View>
            }
          />
          <Chart
            current={bodyFatPercentage}
            filter={filter}
            title="Body fat percentage"
            highest={bodyFatItems.highest}
            lowest={bodyFatItems.lowest}
            minY={0}
            maxY={30}
            data={bodyFatItems.data}
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
            footer={
              <Button
                onPress={() => setShowBodyFatPercentageModal(true)}
                text="Enter body fat percentage"
                style={{
                  width: DevicePixels[300],
                  marginLeft: DevicePixels[40],
                  marginTop: DevicePixels[10],
                }}
              />
            }
          />
          <Chart
            current={muscleMass}
            filter={filter}
            minY={0}
            maxY={70}
            highest={muscleMassItems.highest}
            lowest={muscleMassItems.lowest}
            title="Muscle mass"
            data={muscleMassItems.data}
            suffix="kg"
            ranges={[44.0, 52.4]}
            colors={[]}
            labels={[]}
            footer={
              <Button
                onPress={() => setShowMuscleMassModal(true)}
                text="Enter muscle mass"
                style={{
                  width: DevicePixels[300],
                  marginLeft: DevicePixels[40],
                  marginTop: DevicePixels[10],
                }}
              />
            }
          />
          <Chart
            current={boneDensity}
            title="Bone density"
            data={boneDensityItems.data}
            filter={filter}
            highest={boneDensityItems.highest}
            lowest={boneDensityItems.lowest}
            ranges={[]}
            colors={[]}
            labels={[]}
            footer={
              <Button
                onPress={() => setShowBoneDensityModal(true)}
                text="Enter bone density"
                style={{
                  width: DevicePixels[300],
                  marginTop: DevicePixels[10],
                  marginLeft: DevicePixels[40],
                  marginRight: DevicePixels[20],
                }}
              />
            }
          />
        </ScrollView>
      ) : (
        <View
          style={{
            height: DevicePixels[280],
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Spinner />
        </View>
      )}
    </>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  weightSamples: profile.weightSamples,
  heightSamples: profile.heightSamples,
  bodyFatPercentageSamples: profile.bodyFatPercentageSamples,
  muscleMassSamples: profile.muscleMassSamples,
  boneDensitySamples: profile.boneDensitySamples,
});

const mapDispatchToProps = {
  getSamplesAction: getSamples,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileCharts);
