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

const Chart: React.FC<{
  data: {x: number; y: number}[];
  title: string;
  lowest: number;
  highest: number;
  filter: 6 | 30 | 365;
  footer: ReactNode;
  formatLabel?: (label: string) => string;
}> = ({data, title, footer, formatLabel, lowest, highest, filter}) => {
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
      <VictoryChart
        maxDomain={{y: highest + 5}}
        minDomain={{y: lowest - 5}}
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
        <VictoryAxis dependentAxis />
      </VictoryChart>
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
  const [showCharts, setShowCharts] = useState(false);

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
      InteractionManager.runAfterInteractions(() => {
        setShowCharts(true);
      });
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
            filter={filter}
            title="BMI"
            data={weightItems.data}
            lowest={weightItems.lowest}
            highest={weightItems.highest}
            footer={
              !!latestBMI && (
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
            filter={filter}
            title="Body fat percentage"
            highest={bodyFatItems.highest}
            lowest={bodyFatItems.lowest}
            data={bodyFatItems.data}
            formatLabel={label => {
              return `${label.slice(0, -3)} %`;
            }}
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
            filter={filter}
            highest={muscleMassItems.highest}
            lowest={muscleMassItems.lowest}
            title="Muscle mass"
            data={muscleMassItems.data}
            formatLabel={label => {
              return `${label.slice(0, -3)} kg`;
            }}
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
            title="Bone density"
            data={boneDensityItems.data}
            filter={filter}
            highest={boneDensityItems.highest}
            lowest={boneDensityItems.lowest}
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
