import {View, Text, ScrollView, Dimensions, Linking} from 'react-native';
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
  getSamplesAction: () => void;
}> = ({profile, weightSamples, heightSamples, getSamplesAction}) => {
  const weightItems: {
    labels: string[];
    data: number[];
    minMax: number[];
  } = useMemo(() => {
    return getBMIItems(profile, weightSamples, heightSamples);
  }, [weightSamples, profile, heightSamples]);

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
});

const mapDispatchToProps = {
  getSamplesAction: getSamples,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileCharts);
