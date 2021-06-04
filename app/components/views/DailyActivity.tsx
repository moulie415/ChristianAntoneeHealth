import React, {FunctionComponent, useMemo} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import moment, {Moment} from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import styles from '../../styles/views/Activity';
import {List, Text} from '@ui-kitten/components';
import {getSamples} from '../../actions/profile';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import DailyActivityProps from '../../types/views/DailyActivity';
import CustomDivider from '../commons/CustomDivider';

interface Item {
  steps?: number;
  day: Moment;
}

const DailyActivity: FunctionComponent<DailyActivityProps> = ({
  weeklySteps,
}) => {
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
      style={{backgroundColor: colors.appBlack, flex: 1}}
      data={listItems}
      renderItem={({item}: {item: Item}) => {
        return (
          <View>
            <Text category="h5" style={{padding: 5}}>
              {item.day.format('dddd')}
            </Text>
            <CustomDivider />
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#303030',
                padding: 5,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  size={20}
                  style={{margin: 5}}
                  name="shoe-prints"
                  color={colors.appBlue}
                />
                <Text>Steps</Text>
              </View>
              <Text>{item.steps}</Text>
            </View>
            <CustomDivider />
          </View>
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
