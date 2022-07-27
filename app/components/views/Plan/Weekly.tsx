import {View, SectionList, Alert} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {MyRootState, Plan, PlanTest, PlanWorkout} from '../../../types/Shared';
import {connect} from 'react-redux';
import moment from 'moment';
import DevicePixels from '../../../helpers/DevicePixels';
import Text from '../../commons/Text';
import {getExercisesById, setWorkout} from '../../../actions/exercises';
import {getTestsById} from '../../../actions/tests';
import Exercise from '../../../types/Exercise';
import Test from '../../../types/Test';
import ImageOverlay from '../../commons/ImageOverlay';
import colors from '../../../constants/colors';
import {navigate} from '../../../RootNavigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ListItem from '../../commons/ListItem';
import Spinner from '../../commons/Spinner';

const Weekly: React.FC<{
  plan: Plan;
  loading: boolean;
  exercises: {[key: string]: Exercise};
  tests: {[key: string]: Test};
  getExercisesById: (ids: string[]) => void;
  getTestsById: (ids: string[]) => void;
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
        w.dates.find(
          d =>
            (moment(d).isAfter(moment().startOf('day')) ||
              moment(d).isSame(moment().startOf('day'))) &&
            moment(d).isBefore(moment().startOf('day').add(7, 'days')),
        ),
      ) || []
    );
  }, [plan.workouts]);

  const tests = useMemo(() => {
    return (
      plan.tests?.filter(t =>
        t.dates.find(
          d =>
            (moment(d).isAfter(moment().startOf('day')) ||
              moment(d).isSame(moment().startOf('day'))) &&
            moment(d).isBefore(moment().startOf('day').add(7, 'days')),
        ),
      ) || []
    );
  }, [plan.tests]);

  const sections: {title: string; data: (PlanWorkout | PlanTest)[]}[] = [];

  for (let i = 0; i < 7; i++) {
    const day = moment().add(i, 'days');
    const data = [...workouts, ...tests]
      .filter(item => {
        return item.dates.some(date => moment(date).isSame(day, 'day'));
      })
      .map(item => {
        return {...item, today: i === 0};
      });
    sections.push({title: moment(day).format('dddd'), data});
  }

  useEffect(() => {
    if (workouts.length) {
      const allExercises = workouts.reduce((acc, cur) => {
        return [...acc, ...cur.exercises.map(e => e.exercise)];
      }, []);
      const missingExerciseIds = allExercises.filter(id => !exercises[id]);
      if (missingExerciseIds.length) {
        getExercisesByIdAction(missingExerciseIds);
      }
    }
  }, [exercises, workouts, getExercisesByIdAction]);

  useEffect(() => {
    if (tests.length) {
      const missingTestIds = tests.map(t => t.test).filter(id => !testsObj[id]);
      if (missingTestIds.length) {
        getTestsByIdAction(missingTestIds);
      }
    }
  }, [getTestsByIdAction, tests, testsObj]);

  return (
    <View>
      <SectionList
        sections={sections}
        renderSectionHeader={({section: {title}}) => (
          <Text style={{padding: DevicePixels[5]}}>{title}</Text>
        )}
        renderItem={({item}) => {
          if ('name' in item) {
            return (
              <ListItem
                onPress={() => {
                  if (item.today) {
                    setWorkoutAction(
                      item.exercises.map(e => {
                        return {
                          ...exercises[e.exercise],
                          ...e,
                        };
                      }),
                    );
                    const isLast = !sections.some(section => {
                      section.data.some(i =>
                        i.dates.some(date => {
                          item.dates.some(d => moment(d).isBefore(date));
                        }),
                      );
                    });
                    navigate('StartWorkout', {name: item.name, isLast});
                  } else {
                    Alert.alert('Workout not due today', 'View early?', [
                      {text: 'Cancel'},
                      {
                        text: 'Yes',
                        onPress: () => {
                          setWorkoutAction(
                            item.exercises.map(e => {
                              return {
                                ...exercises[e.exercise],
                                ...e,
                              };
                            }),
                          );
                          const isLast = !sections.some(section => {
                            section.data.some(i =>
                              i.dates.some(date => {
                                item.dates.some(d => moment(d).isBefore(date));
                              }),
                            );
                          });
                          navigate('StartWorkout', {name: item.name, isLast});
                        },
                      },
                    ]);
                  }
                }}
                disabled={loading}
                title={item.name}
                accessoryLeft={
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
                          <Text style={{color: colors.appWhite}}>
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
                }
              />
            );
          }
          return (
            <ListItem
              onPress={() => {
                if (item.today) {
                  navigate('Test', {id: item.test});
                } else {
                  Alert.alert('Test not due today', 'View early?', [
                    {text: 'Cancel'},
                    {
                      text: 'Yes',
                      onPress: () => {
                        navigate('Test', {id: item.test});
                      },
                    },
                  ]);
                }
              }}
              disabled={loading}
              title={testsObj[item.test]?.name || ''}
              accessoryLeft={
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
              }
            />
          );
        }}
      />
    </View>
  );
};

const mapStateToProps = ({profile, exercises, tests}: MyRootState) => ({
  plan: profile.plan,
  loading: profile.loading,
  exercises: exercises.exercises,
  tests: tests.tests,
});

const mapDispatchToProps = {
  getExercisesById,
  getTestsById,
  setWorkout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Weekly);
