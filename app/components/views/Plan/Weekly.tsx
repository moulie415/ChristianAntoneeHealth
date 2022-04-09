import {View, Text} from 'react-native';
import React from 'react';
import {MyRootState, Plan} from '../../../types/Shared';
import {connect} from 'react-redux';
import moment from 'moment';

const Weekly: React.FC<{plan: Plan}> = ({plan}) => {
  const workouts = plan.workouts?.filter(w =>
    w.dates.find(
      d =>
        moment(d).isAfter(moment().startOf('day')) &&
        moment(d).isBefore(moment().startOf('day').add(7, 'days')),
    ),
  );

  const tests = plan.tests?.filter(t =>
    t.dates.find(
      d =>
        moment(d).isAfter(moment().startOf('day')) &&
        moment(d).isBefore(moment().startOf('day').add(7, 'days')),
    ),
  );

  
  return <View ></View>;
};

const mapStateToProps = ({profile}: MyRootState) => ({
  plan: profile.plan,
});

export default connect(mapStateToProps)(Weekly);
