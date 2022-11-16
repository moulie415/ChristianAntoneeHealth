import {
  View,
  ScrollView,
  Dimensions,
  Linking,
  TouchableOpacity,
} from 'react-native';
import React, {ReactNode, useEffect, useMemo, useState} from 'react';
import DevicePixels from '../../helpers/DevicePixels';
import {PERCENTAGES, weightChartConfig} from '../../constants';
import {LineChart} from 'react-native-chart-kit';
import colors from '../../constants/colors';
import {LineChartData} from 'react-native-chart-kit/dist/line-chart/LineChart';
import {connect} from 'react-redux';
import {MyRootState, Sample} from '../../types/Shared';
import {getSamples} from '../../actions/profile';
import {getBMIItems, getSampleItems} from '../../helpers';
import LinearGradient from 'react-native-linear-gradient';
import Text from './Text';
import Button from './Button';

const Chart: React.FC<{
  data: LineChartData;
  title: string;
  footer: ReactNode;
}> = ({data, title, footer}) => {
  return (
    <View>
      <Text
        style={{
          margin: DevicePixels[20],
          color: colors.appWhite,
          fontWeight: 'bold',
          fontSize: DevicePixels[24],
        }}>
        {title}
      </Text>
      <LineChart
        data={data}
        width={Dimensions.get('screen').width * 0.9}
        height={DevicePixels[200]}
        chartConfig={weightChartConfig}
        // withVerticalLines={false}
        formatYLabel={label => {
          return label.slice(0, -1);
        }}
        withShadow={false}
      />
      {footer}
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
}) => {
  const [filter, setFilter] = useState<6 | 30 | 365>(6);

  const weightItems: {
    data: number[];
    chartData: LineChartData;
  } = useMemo(() => {
    return getBMIItems(weight, height, weightSamples, heightSamples, filter);
  }, [weightSamples, weight, height, heightSamples, filter]);

  const bodyFatItems: {
    data: number[];
    chartData: LineChartData;
  } = useMemo(() => {
    return getSampleItems(bodyFatPercentage, filter, bodyFatPercentageSamples);
  }, [bodyFatPercentageSamples, filter, bodyFatPercentage]);

  const muscleMassItems: {
    data: number[];
    chartData: LineChartData;
  } = useMemo(() => {
    return getSampleItems(muscleMass, filter, muscleMassSamples);
  }, [muscleMassSamples, filter, muscleMass]);

  const boneDensityItems: {
    data: number[];
    chartData: LineChartData;
  } = useMemo(() => {
    return getSampleItems(boneDensity, filter, boneDensitySamples);
  }, [boneDensitySamples, filter, boneDensity]);

  useEffect(() => {
    const init = async () => {
      // if (await isEnabled()) {
      getSamplesAction();
      // }
    };
    init();
  }, [getSamplesAction]);

  const latestBMI = weightItems?.data[weightItems.data.length - 1];

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
      <ScrollView horizontal>
        <Chart
          title="BMI"
          data={weightItems.chartData}
          footer={
            latestBMI && (
              <>
                <Text
                  style={{
                    color: colors.appWhite,
                    fontSize: DevicePixels[16],
                    marginHorizontal: DevicePixels[20],
                    marginVertical: DevicePixels[10],
                  }}>
                  Your current BMI is{' '}
                  <Text style={{fontWeight: 'bold'}}>{latestBMI}</Text>
                </Text>

                <Text
                  onPress={() =>
                    Linking.openURL(
                      'https://www.nhs.uk/common-health-questions/lifestyle/what-is-the-body-mass-index-bmi/',
                    )
                  }
                  style={{
                    color: colors.appWhite,
                    fontWeight: 'bold',
                    textDecorationLine: 'underline',
                    marginHorizontal: DevicePixels[20],
                    marginBottom: DevicePixels[20],
                  }}>
                  What does this mean?
                </Text>
              </>
            )
          }
        />
        <Chart
          title="Body fat percentage"
          data={bodyFatItems.chartData}
          footer={
            <Button
              onPress={() => setShowBodyFatPercentageModal(true)}
              text="Set body fat percentage"
              style={{
                width: DevicePixels[300],
                marginLeft: DevicePixels[40],
                marginTop: DevicePixels[10],
              }}
            />
          }
        />
        <Chart
          title="Muscle mass"
          data={muscleMassItems.chartData}
          footer={
            <Button
              onPress={() => setShowMuscleMassModal(true)}
              text="Set muscle mass"
              style={{
                width: DevicePixels[300],
                marginLeft: DevicePixels[40],
                marginTop: DevicePixels[10],
              }}
            />
          }
        />
        <Chart
          title="Bone density"
          data={boneDensityItems.chartData}
          footer={
            <Button
              onPress={() => setShowBoneDensityModal(true)}
              text="Set bone density"
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
