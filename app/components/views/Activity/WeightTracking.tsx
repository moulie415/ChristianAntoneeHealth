import {Dimensions, View} from 'react-native';
import React, {useMemo} from 'react';
import Text from '../../commons/Text';
import {LineChart} from 'react-native-chart-kit';
import moment from 'moment';
import DevicePixels from '../../../helpers/DevicePixels';
import {weightChartConfig} from '../../../constants';
import colors from '../../../constants/colors';
import {getWeightItems} from '../../../helpers';
import {MyRootState, Sample, StepSample} from '../../../types/Shared';
import Profile from '../../../types/Profile';
import {connect} from 'react-redux';

const WeightTracking: React.FC<{
  weightSamples: {[key: number]: Sample[]};
  stepSamples: {[key: number]: StepSample[]};
  profile: Profile;
}> = ({weightSamples, profile}) => {
  const monthlyWeightSamples = weightSamples[moment().month()];
  const weightItems: {
    labels: string[];
    data: number[];
    minMax: number[];
  } = useMemo(() => {
    return getWeightItems(profile, monthlyWeightSamples);
  }, [monthlyWeightSamples, profile]);

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
  return (
    <View>
      <Text
        category="s1"
        style={{textAlign: 'center', marginVertical: DevicePixels[20]}}>
        Weight tracking
      </Text>
      <LineChart
        data={weightData}
        width={Dimensions.get('screen').width * 0.9}
        height={DevicePixels[220]}
        chartConfig={weightChartConfig}
        withVerticalLines={false}
        withShadow={false}
      />
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  weightSamples: profile.weightSamples,
  stepSamples: profile.stepSamples,
  profile: profile.profile,
});

export default connect(mapStateToProps)(WeightTracking);
