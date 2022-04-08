import {View} from 'react-native';
import React from 'react';
import {MyRootState, Plan} from '../../../types/Shared';
import {connect} from 'react-redux';
import moment from 'moment';
import Text from '../../commons/Text';

const Daily: React.FC<{plan: Plan}> = ({plan}) => {
  const workout = plan.workouts?.find(w =>
    w.dates.find(d => moment(d).isSame(moment(), 'day')),
  );

  const test = plan.tests?.find(t =>
    t.dates.find(d => moment(d).isSame(moment(), 'day')),
  );

  return (
    <View>
      {workout || test ? (
        <View />
      ) : (
        <View>
          <Text>Nothing scheduled for today</Text>
        </View>
      )}
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  plan: profile.plan,
});

export default connect(mapStateToProps)(Daily);
