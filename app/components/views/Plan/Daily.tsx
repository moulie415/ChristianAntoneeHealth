import {SectionList, View} from 'react-native';
import React from 'react';
import {MyRootState, Plan, PlanTest, PlanWorkout} from '../../../types/Shared';
import {connect} from 'react-redux';
import moment from 'moment';
import Text from '../../commons/Text';
import {ListItem} from '@ui-kitten/components';
import ImageOverlay from '../../commons/ImageOverlay';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';

const Daily: React.FC<{plan: Plan}> = ({plan}) => {
  const workouts =
    plan.workouts?.filter(w =>
      w.dates.find(d => moment(d).isSame(moment(), 'day')),
    ) || [];

  const tests =
    plan.tests?.filter(t =>
      t.dates.find(d => moment(d).isSame(moment(), 'day')),
    ) || [];

  const data: {title: string; data: (PlanWorkout | PlanTest)[]}[] = [];

  if (workouts.length) {
    data.push({
      title: 'Workouts',
      data: workouts,
    });
  }

  if (tests.length) {
    data.push({
      title: 'Tests',
      data: tests,
    });
  }

  return (
    <View>
      {data.length ? (
        <SectionList
          sections={data}
          renderSectionHeader={({section: {title}}) => (
            <Text style={{}}>{title}</Text>
          )}
          renderItem={({item}) => {
            if ('name' in item) {
              return (
                <ListItem
                  title={item.name}
                  accessoryLeft={() => (
                    <ImageOverlay
                      containerStyle={{
                        height: DevicePixels[75],
                        width: DevicePixels[75],
                      }}
                      overlayAlpha={0.4}
                      source={require('../../../images/old_man_stretching.jpeg')}>
                      <View style={{alignItems: 'center'}}>
                        <Text category="h6" style={{color: colors.appWhite}}>
                          {item.exercises.length}
                        </Text>
                        <Text style={{color: colors.appWhite}}>
                          {item.exercises.length > 1 ? 'exercises' : 'exercise'}
                        </Text>
                      </View>
                    </ImageOverlay>
                  )}
                />
              );
            }
            return null;
          }}
        />
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
