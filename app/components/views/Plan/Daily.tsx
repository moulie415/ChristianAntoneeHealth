import {SectionList, View} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {MyRootState, Plan, PlanTest, PlanWorkout} from '../../../types/Shared';
import {connect} from 'react-redux';
import moment from 'moment';
import Text from '../../commons/Text';
import {ListItem, Spinner} from '@ui-kitten/components';
import ImageOverlay from '../../commons/ImageOverlay';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import Exercise from '../../../types/Exercise';
import Test from '../../../types/Test';
import {getExercisesById, setWorkout} from '../../../actions/exercises';
import {navigate} from '../../../RootNavigation';
import {getTestsById} from '../../../actions/tests';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Daily: React.FC<{
  plan: Plan;
  viewPlanWorkout: (workout: PlanWorkout) => void;
  viewPlanTest: (test: PlanTest) => void;
  exercises: {[key: string]: Exercise};
  tests: {[key: string]: Test};
  getExercisesById: (ids: string[]) => void;
  getTestsById: (ids: string[]) => void;
  loading: boolean;
  setWorkout: (workout: Exercise[]) => void;
}> = ({
  plan,
  exercises,
  tests: testsObj,
  getExercisesById: getExercisesByIdAction,
  getTestsById: getTestsByIdAction,
  loading,
  setWorkout: setWorkoutAction,
}) => {
  const workouts = useMemo(() => {
    return (
      plan.workouts?.filter(w =>
        w.dates.find(d => moment(d).isSame(moment(), 'day')),
      ) || []
    );
  }, [plan.workouts]);

  const tests = useMemo(() => {
    return (
      plan.tests?.filter(t =>
        t.dates.find(d => moment(d).isSame(moment(), 'day')),
      ) || []
    );
  }, [plan.tests]);

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

  useEffect(() => {
    if (workouts.length) {
      const allExercises = workouts.reduce((acc, cur) => {
        return [...acc, ...cur.exercises.map(e => e.exercise)];
      }, []);
      const missingExerciseIds = allExercises.filter(id => !exercises[id]);
      getExercisesByIdAction(missingExerciseIds);
    }
  }, [exercises, workouts, getExercisesByIdAction]);

  useEffect(() => {
    if (tests.length) {
      const missingTestIds = tests.map(t => t.test).filter(id => !testsObj[id]);
      getTestsByIdAction(missingTestIds);
    }
  }, [getTestsByIdAction, tests, testsObj]);

  return (
    <View>
      {data.length ? (
        <SectionList
          sections={data}
          renderSectionHeader={({section: {title}}) => (
            <Text style={{padding: DevicePixels[5]}} category="h6">
              {title}
            </Text>
          )}
          renderItem={({item}) => {
            if ('name' in item) {
              return (
                <ListItem
                  onPress={() => {
                    setWorkoutAction(
                      item.exercises.map(e => {
                        return {
                          ...exercises[e.exercise],
                          ...e,
                        };
                      }),
                    );
                    navigate('StartWorkout');
                  }}
                  disabled={loading}
                  title={() => (
                    <Text category="h6" style={{padding: DevicePixels[5]}}>
                      {item.name}
                    </Text>
                  )}
                  accessoryLeft={() => (
                    <ImageOverlay
                      containerStyle={{
                        height: DevicePixels[75],
                        width: DevicePixels[75],
                      }}
                      overlayAlpha={0.4}
                      source={require('../../../images/old_man_stretching.jpeg')}>
                      <View style={{alignItems: 'center'}}>
                        {loading ? (
                          <Spinner style={{borderColor: colors.appWhite}} />
                        ) : (
                          <>
                            <Text
                              category="h6"
                              style={{color: colors.appWhite}}>
                              {item.exercises.length}
                            </Text>
                            <Text style={{color: colors.appWhite}}>
                              {item.exercises.length > 1
                                ? 'exercises'
                                : 'exercise'}
                            </Text>
                          </>
                        )}
                      </View>
                    </ImageOverlay>
                  )}
                />
              );
            }
            return (
              <ListItem
                onPress={() => {
                  navigate('Test', {id: item.test});
                }}
                disabled={loading}
                title={() => (
                  <Text category="h6" style={{padding: DevicePixels[5]}}>
                    {testsObj[item.test]?.name || ''}
                  </Text>
                )}
                accessoryLeft={() => (
                  <ImageOverlay
                    containerStyle={{
                      height: DevicePixels[75],
                      width: DevicePixels[75],
                    }}
                    overlayAlpha={0.4}
                    source={require('../../../images/old_man_stretching.jpeg')}>
                    <View style={{alignItems: 'center'}}>
                      {loading ? (
                        <Spinner style={{borderColor: colors.appWhite}} />
                      ) : (
                        <Icon
                          name="stopwatch"
                          color={colors.appWhite}
                          size={DevicePixels[25]}
                        />
                      )}
                    </View>
                  </ImageOverlay>
                )}
              />
            );
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

const mapStateToProps = ({profile, exercises, tests}: MyRootState) => ({
  plan: profile.plan,
  exercises: exercises.exercises,
  tests: tests.tests,
  loading: exercises.loading,
});

const mapDispatchToProps = {
  getExercisesById,
  getTestsById,
  setWorkout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Daily);
