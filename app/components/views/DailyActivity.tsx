import React, {useMemo} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import moment, {Moment} from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import styles from '../../styles/views/Activity';
import {Layout, List, Text} from '@ui-kitten/components';
import {getSamples} from '../../actions/profile';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import DailyActivityProps from '../../types/views/DailyActivity';
import CustomDivider from '../commons/CustomDivider';
import DevicePixels from '../../helpers/DevicePixels';

interface Item {
  steps?: number;
  day: Moment;
}

const DailyActivity: React.FC<DailyActivityProps> = ({weeklySteps}) => {
  const listItems: Item[] = useMemo(() => {
    const items = [];
    for (let i = 0; i < 7; i++) {
      const day = moment().subtract(i, 'days');
      const dayOfYear = day.dayOfYear();
      const steps = weeklySteps.find(
        s => moment(s.date).dayOfYear() === dayOfYear,
      )?.value;
      items.push({steps, day});
    }
    return items;
  }, [weeklySteps]);
  return (
    <List
      style={{flex: 1}}
      data={listItems}
      renderItem={({item}: {item: Item}) => {
        return (
          <Layout>
            <Text category="h5" style={{padding: DevicePixels[5]}}>
              {item.day.format('dddd')}
            </Text>
            <CustomDivider />
            <Layout
              style={{
                flexDirection: 'row',
                padding: DevicePixels[5],
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Layout style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  size={DevicePixels[20]}
                  style={{margin: DevicePixels[5]}}
                  name="shoe-prints"
                  color={colors.appBlue}
                />
                <Text>Steps</Text>
              </Layout>
              <Text>{item.steps}</Text>
            </Layout>
            <CustomDivider />
          </Layout>
        );
      }}
    />
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  weeklySteps: profile.weeklySteps,
});

const mapDispatchToProps = {
  getSamplesAction: getSamples,
};

export default connect(mapStateToProps, mapDispatchToProps)(DailyActivity);
