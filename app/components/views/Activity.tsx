import {Text} from '@ui-kitten/components';
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
    <View style={{backgroundColor: colors.appBlack, flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 20,
        }}>
        <TouchableOpacity
          onPress={() => setPage(0)}
          style={{
            padding: 8,
            width: 75,
            borderColor: colors.borderColor,
            borderWidth: StyleSheet.hairlineWidth,
            backgroundColor: index === 0 ? colors.appBlue : undefined,
          }}>
          <Text style={{textAlign: 'center'}}>Day</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setPage(1)}
          style={{
            padding: 8,
            width: 75,
            borderColor: colors.borderColor,
            borderWidth: StyleSheet.hairlineWidth,
            backgroundColor: index === 1 ? colors.appBlue : undefined,
          }}>
          <Text style={{textAlign: 'center'}}>Week</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setPage(2)}
          style={{
            padding: 8,
            width: 75,
            borderColor: colors.borderColor,
            borderWidth: StyleSheet.hairlineWidth,
            backgroundColor: index === 2 ? colors.appBlue : undefined,
          }}>
          <Text style={{textAlign: 'center'}}>Month</Text>
        </TouchableOpacity>
      </View>
      <PagerView
        ref={pagerRef}
        onPageSelected={e => setIndex(e.nativeEvent.position)}
        style={{flex: 1}}>
        <DailyActivity />
        <WeeklyActivity />
        <MonthlyActivity />
      </PagerView>
    </View>
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
