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
import Profile from '../../types/Profile';
import moment from 'moment';
import {getBMIItems} from '../../helpers';
import {isEnabled} from '../../helpers/biometrics';
import PickerModal from './PickerModal';
import LinearGradient from 'react-native-linear-gradient';
import Text from './Text';

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
  profile: Profile;
  weightSamples: Sample[];
  heightSamples: Sample[];
  bodyFatPercentageSamples: Sample[];
  muscleMassSamples: Sample[];
  boneDensitySamples: Sample[];
  getSamplesAction: () => void;
}> = ({
  profile,
  weightSamples,
  heightSamples,
  bodyFatPercentageSamples,
  muscleMassSamples,
  boneDensitySamples,
  getSamplesAction,
}) => {
  const [filter, setFilter] = useState<6 | 30 | 365>(6);

  const weightItems: {
    labels: string[];
    data: number[];
    minMax: number[];
  } = useMemo(() => {
    return getBMIItems(profile, weightSamples, heightSamples, filter);
  }, [weightSamples, profile, heightSamples, filter]);

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
          data={weightData}
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
          data={weightData}
          footer={
            !!profile.bodyFatPercentage && (
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: DevicePixels[16],
                  marginHorizontal: DevicePixels[20],
                  marginVertical: DevicePixels[10],
                }}>
                Your current body fat percentage is
                <Text
                  style={{
                    fontWeight: 'bold',
                  }}>{`${profile.bodyFatPercentage}%`}</Text>
              </Text>
            )
          }
        />
        <Chart
          title="Muscle mass"
          data={weightData}
          footer={
            !!profile.bodyFatPercentage && (
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: DevicePixels[16],
                  marginHorizontal: DevicePixels[20],
                  marginVertical: DevicePixels[10],
                }}>
                Your current body fat percentage is
                <Text
                  style={{
                    fontWeight: 'bold',
                  }}>{`${profile.bodyFatPercentage}%`}</Text>
              </Text>
            )
          }
        />
        <Chart
          title="Bone density"
          data={weightData}
          footer={
            !!profile.bodyFatPercentage && (
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: DevicePixels[16],
                  marginHorizontal: DevicePixels[20],
                  marginVertical: DevicePixels[10],
                }}>
                Your current body fat percentage is
                <Text
                  style={{
                    fontWeight: 'bold',
                  }}>{`${profile.bodyFatPercentage}%`}</Text>
              </Text>
            )
          }
        />
      </ScrollView>
    </>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
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
