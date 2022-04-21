import {View, SectionList} from 'react-native';
import React from 'react';
import {MyRootState, Plan} from '../../../types/Shared';
import {connect} from 'react-redux';
import moment from 'moment';
import DevicePixels from '../../../helpers/DevicePixels';
import Text from '../../commons/Text';

const Weekly: React.FC<{plan: Plan}> = ({plan}) => {
  const workouts =
    plan.workouts?.filter(w =>
      w.dates.find(
        d =>
          moment(d).isAfter(moment().startOf('day')) &&
          moment(d).isBefore(moment().startOf('day').add(7, 'days')),
      ),
    ) || [];

  const tests =
    plan.tests?.filter(t =>
      t.dates.find(
        d =>
          moment(d).isAfter(moment().startOf('day')) &&
          moment(d).isBefore(moment().startOf('day').add(7, 'days')),
      ),
    ) || [];

  const sections = [];

  for (let i = 0; i < 7; i++) {
    const day = moment().subtract(i, 'days');
    sections.push({title: moment(day).format('dddd'), data: []});
  }

  return (
    <View>
      <SectionList
        sections={sections}
        renderSectionHeader={({section: {title}}) => (
          <Text style={{padding: DevicePixels[5]}} category="h6">
            {title}
          </Text>
        )}
        renderItem={({item}) => null}
      />
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  plan: profile.plan,
});

export default connect(mapStateToProps)(Weekly);
