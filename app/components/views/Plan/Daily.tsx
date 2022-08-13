import {SectionList, View} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {MyRootState, Plan, PlanTest, PlanWorkout} from '../../../types/Shared';
import {connect} from 'react-redux';
import moment from 'moment';
import Text from '../../commons/Text';
import ImageOverlay from '../../commons/ImageOverlay';
import DevicePixels from '../../../helpers/DevicePixels';
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
import Image from 'react-native-fast-image';
import ListItem from '../../commons/ListItem';
import Spinner from '../../commons/Spinner';
import Divider from '../../commons/Divider';

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
            <Text style={{padding: DevicePixels[5]}}>{title}</Text>
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
                    const isLast = !data.some(section => {
                      section.data.some(i =>
                        i.dates.some(date => {
                          item.dates.some(d => moment(d).isBefore(date));
                        }),
                      );
                    });
                    navigate('StartWorkout', {name: item.name, isLast});
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
                  navigate('Test', {id: item.test});
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
      ) : (
        <View style={{padding: DevicePixels[10]}}>
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
                  height: DevicePixels[50],
                }}>
                <Spinner />
              </View>
            ) : (
              <View>
                <Text style={{padding: DevicePixels[5]}}>Education</Text>
                {plan.education.map(id => {
                  const item = education[id];
                  if (!item) {
                    return null;
                  }
                  return (
                    <View key={id}>
                      <Divider />
                      <ListItem
                        title={item.title}
                        onPress={() =>
                          navigate('EducationArticle', {
                            education: item,
                          })
                        }
                        description={moment(item.createdate).format(
                          'DD MMMM YYYY',
                        )}
                        accessoryLeft={
                          <Image
                            style={{
                              width: DevicePixels[75],
                              height: DevicePixels[50],
                            }}
                            source={{uri: item.image.src}}
                          />
                        }
                      />
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}
        {(!!plan.nutrition || !!plan.sleep) && (
          <Text style={{padding: DevicePixels[5]}}>Other</Text>
        )}
        {!!plan.nutrition && !_.isEmpty(plan.nutrition) && (
          <>
            <Divider />
            <Icon
              name="apple-alt"
              size={DevicePixels[20]}
              color={colors.appBlue}
            />
            <Text>Nutritional planning</Text>
            <View style={{marginLeft: DevicePixels[10]}}>
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
            <ListItem
              title="Sleep hygiene"
              description={plan.sleep.general}
              accessoryLeft={
                <Icon
                  name="bed"
                  size={DevicePixels[20]}
                  color={colors.appBlue}
                />
              }
            />
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
