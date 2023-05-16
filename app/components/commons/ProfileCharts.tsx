import {View, Dimensions, TouchableOpacity} from 'react-native';
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
import LinearGradient from 'react-native-linear-gradient';
import Text from './Text';
import Button from './Button';
import Spinner from './Spinner';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  VictoryArea,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLine,
} from 'victory-native';
import moment from 'moment';
import MetricExplainedModal from './MetricExplainedModal';
import Color from 'color';
import PagerView from 'react-native-pager-view';

const Chart: React.FC<{
  data: {x: number; y: number}[];
  title: string;
  lowest: number;
  highest: number;
  filter: 6 | 30 | 365;
  capitalize?: boolean;
  current?: number;
  suffix?: string;
  footer?: ReactNode;
  minY?: number;
  maxY?: number;
  ranges: number[];
  colors: string[];
  labels: string[];
  pagerRef: MutableRefObject<PagerView | null>;
  index: number;
  isLast?: boolean;
  isFirst?: boolean;
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
  pagerRef,
  index,
  isFirst,
  isLast,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={{alignItems: 'center'}}>
      <Text
        style={{
          margin: 20,
          color: colors.appWhite,
          fontWeight: 'bold',
          fontSize: 20,
          marginBottom: 0,
        }}>
        {title}
      </Text>
      <View
        style={{
          marginTop: -20,
          width: Dimensions.get('window').width * 0.9,
          alignItems: 'center',
        }}>
        <VictoryChart
          maxDomain={{
            y: maxY !== undefined && maxY > highest + 5 ? maxY : highest + 5,
          }}
          minDomain={{y: minY !== undefined ? minY : lowest - 5}}
          width={Dimensions.get('window').width * 0.9}
          height={250}
          theme={VictoryTheme.material}>
          <VictoryArea style={{data: {fill: colors.appBlue}}} data={data} />
          {/* <VictoryLine style={{data: {fill: colors.appBlue}}} data={data} /> */}

          <VictoryAxis
            offsetY={50}
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
          <VictoryAxis dependentAxis tickFormat={x => `${x}${suffix || ''}`} />
        </VictoryChart>
        <View style={{marginLeft: 20}}>
          {current !== undefined && (
            <Text
              style={{
                color: colors.appWhite,
                fontSize: 16,
                marginHorizontal: 20,
                marginVertical: 10,
                textAlign: 'center',
              }}>
              Your current{' '}
              {capitalize ? title.toUpperCase() : title.toLowerCase()} is{' '}
              <Text style={{fontWeight: 'bold'}}>
                {current + (suffix || '')}
              </Text>
            </Text>
          )}

          {current !== undefined && (
            <Text
              onPress={() => setModalVisible(true)}
              style={{
                color: colors.appWhite,
                fontWeight: 'bold',
                textDecorationLine: 'underline',
                marginHorizontal: 20,
                marginBottom: 20,
                textAlign: 'center',
              }}>
              What does this mean?
            </Text>
          )}
        </View>
        {footer}
      </View>
      {minY !== undefined && !!maxY && !!ranges && (
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
      )}

      {!isFirst && (
        <TouchableOpacity
          onPress={() => pagerRef.current?.setPage(index - 1)}
          style={{
            position: 'absolute',
            left: 0,
            top: 150,
            padding: 10,
          }}>
          <Icon
            style={{opacity: 0.8}}
            name="chevron-left"
            size={30}
            color="#fff"
          />
        </TouchableOpacity>
      )}
      {!isLast && (
        <TouchableOpacity
          onPress={() => pagerRef.current?.setPage(index + 1)}
          style={{
            position: 'absolute',
            right: 0,
            top: 150,
            padding: 10,
          }}>
          <Icon
            style={{opacity: 0.8}}
            name="chevron-right"
            size={30}
            color="#fff"
          />
        </TouchableOpacity>
      )}
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
  const pagerRef = useRef<PagerView>(null);

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
      <Text
        style={{
          marginTop: 20,

          color: colors.appWhite,
          fontWeight: 'bold',
          alignSelf: 'center',
          fontSize: 24,
        }}>
        Biometric tracking
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          marginTop: 30,
        }}>
        <TouchableOpacity style={{}} onPress={() => setFilter(6)}>
          <LinearGradient
            colors={
              filter === 6
                ? [colors.appBlueLight, colors.appBlueDark]
                : ['transparent', 'transparent']
            }
            style={{
              height: 40,
              paddingHorizontal: 10,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 25,
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
              height: 40,
              paddingHorizontal: 10,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 25,
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
              height: 40,
              paddingHorizontal: 10,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 25,
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

      <PagerView ref={pagerRef} style={{flex: 1, height: 350}}>
        <Chart
          isFirst
          index={0}
          pagerRef={pagerRef}
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
                  marginTop: 10,
                }}
              />
              <Button
                onPress={() => setShowHeightModal(true)}
                text="Enter height"
                style={{
                  width: '42%',
                  marginTop: 10,
                }}
              />
            </View>
          }
        />

        <Chart
          index={1}
          pagerRef={pagerRef}
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
                width: 300,
                marginTop: 10,
              }}
            />
          }
        />
        <Chart
          index={2}
          pagerRef={pagerRef}
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
          colors={[
            colors.appBlueDark,
            colors.appGreen,
            new Color(colors.appGreen).darken(0.4).toString(),
          ]}
          labels={['Low', 'Normal', 'High']}
          footer={
            <Button
              onPress={() => setShowMuscleMassModal(true)}
              text="Enter muscle mass"
              style={{
                width: 300,

                marginTop: 10,
              }}
            />
          }
        />
        <Chart
          isLast
          index={3}
          pagerRef={pagerRef}
          current={boneMass}
          title="Bone mass"
          data={boneMassItems.data}
          filter={filter}
          suffix="kg"
          highest={boneMassItems.highest}
          lowest={boneMassItems.lowest}
          minY={0}
          maxY={10}
          ranges={[2.09, 3.48]}
          colors={[
            colors.secondaryLight,
            colors.appGreen,
            new Color(colors.appGreen).darken(0.4).toString(),
          ]}
          labels={['Below average', 'Average', 'Above average']}
          footer={
            <Button
              onPress={() => setShowBoneMassModal(true)}
              text="Enter bone mass"
              style={{
                width: 300,
                marginTop: 10,
              }}
            />
          }
        />
      </PagerView>
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
