import {View, Text} from 'react-native';
import React from 'react';
import {MyRootState, Plan} from '../../../types/Shared';
import {connect} from 'react-redux';
import * as _ from 'lodash';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';

const Monthly: React.FC<{plan: Plan}> = ({plan}) => {
  const workoutDates = plan.workouts
    ? plan.workouts.reduce((acc, cur) => {
        if (cur.dates) {
          return [...acc, ...cur.dates];
        }
        return acc;
      }, [])
    : [];
  const testDates = plan.tests
    ? plan.tests.reduce((acc, cur) => {
        if (cur.dates) {
          return [...acc, ...cur.dates];
        }
        return acc;
      }, [])
    : [];

  const uniq = _.uniq([...workoutDates, ...testDates]);

  const dates = uniq.reduce((acc, cur) => {
    if (cur) {
      return {...acc, [cur]: {selected: true}};
    }
  }, {});

  const maxDate = moment(
    Math.max(...uniq.map(date => moment(date).valueOf())),
  ).format('YYYY-MM-DD');

  const minDate = moment(
    Math.min(moment().valueOf(), ...uniq.map(date => moment(date).valueOf())),
  ).format('YYYY-MM-DD');

  return (
    <View>
      <Calendar
        markedDates={dates}
        maxDate={maxDate}
        minDate={minDate}
        onDayPress={({dateString}) => {
          if (dates[dateString]) {
            const workout = plan.workouts?.find(w => {
              w.dates.includes(dateString);
            });
            const test = plan.tests?.find(t => {
              t.dates.includes(dateString);
            });
          }
        }}
      />
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  plan: profile.plan,
});

export default connect(mapStateToProps)(Monthly);
