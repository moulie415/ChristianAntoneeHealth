import {Layout, Text} from '@ui-kitten/components';
import React, {useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import PagerView from 'react-native-pager-view';
import colors from '../../constants/colors';
import ActivityProps from '../../types/views/Activity';
import styles from '../../styles/views/Activity';
import DailyActivity from './DailyActivity';
import WeeklyActivity from './WeeklyActivity';
import MonthlyActivity from './MonthlyActivity';
import {getSamples} from '../../actions/profile';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';
import DevicePixels from '../../helpers/DevicePixels';

const Activity: React.FC<ActivityProps> = ({
  getSamplesAction,
  weightSamples,
  stepSamples,
}) => {
  useEffect(() => {
    getSamplesAction();
  }, [getSamplesAction]);
  const [index, setIndex] = useState(0);
  const pagerRef = useRef<PagerView>();
  const setPage = (page: number) => {
    setIndex(page);
    pagerRef.current.setPage(page);
  };
  return (
    <Layout style={{flex: 1}}>
      <Layout
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          margin: DevicePixels[20],
        }}>
        <TouchableOpacity
          onPress={() => setPage(0)}
          style={{
            padding: DevicePixels[8],
            width: DevicePixels[75],
            borderColor: colors.borderColor,
            borderWidth: StyleSheet.hairlineWidth,
            backgroundColor: index === 0 ? colors.appBlue : undefined,
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: index === 0 ? '#fff' : '#000',
            }}>
            Day
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setPage(1)}
          style={{
            padding: DevicePixels[8],
            width: DevicePixels[75],
            borderColor: colors.borderColor,
            borderWidth: StyleSheet.hairlineWidth,
            backgroundColor: index === 1 ? colors.appBlue : undefined,
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: index === 1 ? '#fff' : '#000',
            }}>
            Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setPage(2)}
          style={{
            padding: DevicePixels[8],
            width: DevicePixels[75],
            borderColor: colors.borderColor,
            borderWidth: StyleSheet.hairlineWidth,
            backgroundColor: index === 2 ? colors.appBlue : undefined,
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: index === 2 ? '#fff' : '#000',
            }}>
            Month
          </Text>
        </TouchableOpacity>
      </Layout>
      <PagerView
        ref={pagerRef}
        onPageSelected={e => setIndex(e.nativeEvent.position)}
        style={{flex: 1}}>
        <DailyActivity />
        <WeeklyActivity />
        <MonthlyActivity />
      </PagerView>
    </Layout>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  weightSamples: profile.weightSamples,
  stepSamples: profile.stepSamples,
});

const mapDispatchToProps = {
  getSamplesAction: getSamples,
};

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
