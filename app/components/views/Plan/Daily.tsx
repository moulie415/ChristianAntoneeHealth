import {SectionList, View, Dimensions} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {MyRootState, Plan, PlanTest, PlanWorkout} from '../../../types/Shared';
import {connect} from 'react-redux';
import moment from 'moment';
import Text from '../../commons/Text';
import ImageOverlay from '../../commons/ImageOverlay';

import colors from '../../../constants/colors';
import Exercise from '../../../types/Exercise';
import Test from '../../../types/Test';
import {getExercisesById, setWorkout} from '../../../actions/exercises';
import {navigate} from '../../../RootNavigation';
import {getTestsById} from '../../../actions/tests';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as _ from 'lodash';
import Education from '../../../types/Education';
import {getEducationById} from '../../../actions/education';
import Spinner from '../../commons/Spinner';
import Divider from '../../commons/Divider';
import WorkoutCard from '../../commons/WorkoutCard';
import TestCard from '../../commons/TestCard';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import FastImageAnimated from '../../commons/FastImageAnimated';

const {height, width} = Dimensions.get('window');

const Daily: React.FC<{
  plan: Plan;
  exercises: {[key: string]: Exercise};
  tests: {[key: string]: Test};
  getExercisesById: (ids: string[]) => void;
  getTestsById: (ids: string[]) => void;
  loading: boolean;
  setWorkout: (workout: Exercise[]) => void;
  education: {[key: string]: Education};
  getEducationById: (ids: string[]) => void;
  educationLoading: boolean;
}> = ({
  plan,
  exercises,
  tests: testsObj,
  getExercisesById: getExercisesByIdAction,
  getTestsById: getTestsByIdAction,
  loading,
  setWorkout: setWorkoutAction,
  education,
  getEducationById: getEducationByIdAction,
  educationLoading,
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

  useEffect(() => {
    if (plan.education && plan.education.length) {
      const missingEducationIds = plan.education.filter(id => !education[id]);
      if (missingEducationIds.length) {
        getEducationByIdAction(missingEducationIds);
      }
    }
  }, [plan.education, education, getEducationByIdAction]);

  return (
    <View>
      {data.length ? (
        <SectionList
          sections={data}
          renderSectionHeader={({section: {title}}) => (
            <Text
              style={{
                padding: 5,
                marginLeft: 10,
                color: colors.appWhite,
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              {title}
            </Text>
          )}
          renderItem={({item}) => {
            if ('name' in item) {
              return (
                <WorkoutCard
                  key={item.name}
                  disabled={loading}
                  item={item}
                  onPress={() => {
                    setWorkoutAction(
                      item.exercises.map(e => {
                        return {
                          ...exercises[e.exercise],
                          ...e,
                        };
                      }),
                    );
                    const isLast = !data.some(section => {
                      section.data.some(i =>
                        i.dates.some(date => {
                          item.dates.some(d => moment(d).isBefore(date));
                        }),
                      );
                    });
                    navigate('StartWorkout', {name: item.name, isLast});
                  }}
                />
              );
            }
            return (
              <TestCard
                key={item.test}
                item={testsObj[item.test]}
                disabled={loading}
                onPress={() => {
                  navigate('Test', {id: item.test});
                }}
              />
            );
          }}
        />
      ) : (
        <View style={{padding: 10}}>
          <Text style={{textAlign: 'center'}}>
            No workouts scheduled for today
          </Text>
        </View>
      )}
      <View>
        {!!plan.education && !!plan.education.length && (
          <View>
            {educationLoading ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 50,
                }}>
                <Spinner />
              </View>
            ) : (
              <View>
                <Text
                  style={{
                    padding: 5,
                    marginLeft: 10,
                    color: colors.appWhite,
                    fontWeight: 'bold',
                    fontSize: 20
                  }}>
                  Education
                </Text>
                <FlatList
                  data={plan.education}
                  renderItem={({item: i}) => {
                    const item = education[i];
                    if (!item) {
                      return null;
                    }
                    return (
                      <TouchableOpacity
                        style={{
                          height: 125,
                          marginHorizontal: 15,
                          marginBottom: 15,
                          borderRadius: 10,
                          overflow: 'hidden',
                        }}
                        onPress={() => {
                          navigate('EducationArticle', {
                            education: item,
                          });
                        }}>
                        <FastImageAnimated
                          style={{
                            position: 'absolute',
                            height: 125,
                            width: '100%',
                          }}
                          source={{uri: item.image.src}}
                        />

                        <View
                          style={{
                            position: 'absolute',
                            alignSelf: 'flex-end',
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: width / 1.5,
                            padding: 10,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                          }}>
                          <Text
                            style={{
                              color: colors.appWhite,
                              fontSize: 10,
                            }}>
                            {moment(item.createdate).format('DD MMMM YYYY')}
                          </Text>
                          <Text
                            style={{
                              color: colors.appWhite,
                              fontSize: 16,
                              fontWeight: 'bold',
                            }}>
                            {item.title}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            )}
          </View>
        )}
        {(!!plan.nutrition || !!plan.sleep) && (
          <Text
            style={{
              padding: 5,
              color: colors.appWhite,
              fontWeight: 'bold',
              marginLeft: 10,
              fontSize: 20,
            }}>
            Other
          </Text>
        )}
        {!!plan.nutrition && !_.isEmpty(plan.nutrition) && (
          <>
            <Divider />
            <View
              style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
              <Icon name="apple-alt" size={20} color={colors.appBlue} />
              <Text
                style={{
                  padding: 5,
                  color: colors.appWhite,
                  fontWeight: 'bold',
                  marginLeft: 10,
                }}>
                Nutritional planning
              </Text>
            </View>
            <View style={{marginLeft: 10}}>
              {!!plan.nutrition.general && (
                <Text>
                  <Text style={{fontWeight: 'bold', color: colors.textGrey}}>
                    General recommendations:{' '}
                  </Text>
                  <Text style={{color: colors.textGrey}}>
                    {plan.nutrition.general}
                  </Text>
                </Text>
              )}
              {!!plan.nutrition.preWorkout && (
                <Text>
                  <Text style={{fontWeight: 'bold', color: colors.textGrey}}>
                    Pre-workout:{' '}
                  </Text>
                  <Text style={{color: colors.textGrey}}>
                    {plan.nutrition.preWorkout}
                  </Text>
                </Text>
              )}
              {!!plan.nutrition.postWorkout && (
                <Text>
                  <Text style={{fontWeight: 'bold', color: colors.textGrey}}>
                    Post-workout:{' '}
                  </Text>
                  <Text style={{color: colors.textGrey}}>
                    {plan.nutrition.postWorkout}
                  </Text>
                </Text>
              )}
            </View>
          </>
        )}
        {!!plan.sleep && !_.isEmpty(plan.sleep) && (
          <>
            <Divider />
            <View
              style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
              <Icon name="bed" size={20} color={colors.appBlue} />
              <Text
                style={{
                  padding: 5,
                  color: colors.appWhite,
                  fontWeight: 'bold',
                  marginLeft: 10,
                }}>
                {`Sleep hygiene: ${plan.sleep.general}`}
              </Text>
            </View>
            <Divider />
          </>
        )}
      </View>
    </View>
  );
};

const mapStateToProps = ({
  profile,
  exercises,
  tests,
  education,
}: MyRootState) => ({
  plan: profile.plan,
  exercises: exercises.exercises,
  tests: tests.tests,
  loading: exercises.loading,
  education: education.education,
  educationLoading: education.loading,
});

const mapDispatchToProps = {
  getExercisesById,
  getTestsById,
  setWorkout,
  getEducationById,
};

export default connect(mapStateToProps, mapDispatchToProps)(Daily);
