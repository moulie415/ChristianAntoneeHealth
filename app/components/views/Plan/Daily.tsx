import {ScrollView, SectionList, View} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {
  MyRootState,
  Plan,
  PlanNutrition,
  PlanSleep,
  PlanTest,
  PlanWorkout,
} from '../../../types/Shared';
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
import EducationCard from '../../commons/EducationCard';
import {objectHasNonEmptyValues} from '../../../helpers';
import NutritionCard from '../../commons/NutritionCard';
import SleepCard from '../../commons/SleepCard';

const Daily: React.FC<{
  plan?: Plan;
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
    if (plan) {
      return (
        plan.workouts?.filter(w =>
          w.dates.find(d => moment(d).isSame(moment(), 'day')),
        ) || []
      );
    }
  }, [plan]);

  const tests = useMemo(() => {
    if (plan) {
      return (
        plan.tests?.filter(t =>
          t.dates.find(d => moment(d).isSame(moment(), 'day')),
        ) || []
      );
    }
  }, [plan]);

  const data: {
    title: string;
    data: (PlanWorkout | PlanTest | PlanSleep | PlanNutrition | string)[];
  }[] = [];

  if (workouts?.length) {
    data.push({
      title: 'Workouts',
      data: workouts,
    });
  }

  if (tests?.length) {
    data.push({
      title: 'Tests',
      data: tests,
    });
  }

  if (plan?.education) {
    data.push({title: 'Education', data: plan.education});
  }

  if (plan?.sleep && plan.sleep.general) {
    data.push({
      title: '',
      data: [plan.sleep],
    });
  }

  if (
    plan?.nutrition &&
    (plan.nutrition.general ||
      plan.nutrition.preWorkout ||
      plan.nutrition.postWorkout)
  ) {
    if (plan.nutrition.preWorkout) {
      data.push({
        title: '',
        data: [plan.nutrition],
      });
    }
  }

  useEffect(() => {
    if (workouts?.length) {
      const allExercises: string[] = workouts.reduce((acc: string[], cur) => {
        return [...acc, ...cur.exercises.map(e => e.exercise)];
      }, []);
      const missingExerciseIds = allExercises.filter(id => !exercises[id]);
      if (missingExerciseIds.length) {
        getExercisesByIdAction(missingExerciseIds);
      }
    }
  }, [exercises, workouts, getExercisesByIdAction]);

  useEffect(() => {
    if (tests?.length) {
      const missingTestIds = tests.map(t => t.test).filter(id => !testsObj[id]);
      if (missingTestIds.length) {
        getTestsByIdAction(missingTestIds);
      }
    }
  }, [getTestsByIdAction, tests, testsObj]);

  useEffect(() => {
    if (plan && plan.education && plan.education.length) {
      const missingEducationIds = plan.education.filter(id => !education[id]);
      if (missingEducationIds.length) {
        getEducationByIdAction(missingEducationIds);
      }
    }
  }, [plan, education, getEducationByIdAction]);

  return (
    <ScrollView>
      <Text
        style={{
          marginLeft: 10,
          color: colors.appWhite,
          fontSize: 30,
          textAlign: 'center',
          fontWeight: 'bold',
        }}>
        Today's Plan
      </Text>
      {workouts?.length ? (
        <>
          <Text
            style={{
              padding: 5,
              marginLeft: 10,
              color: colors.appWhite,
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            Workouts
          </Text>
          {workouts.map(workout => {
            return (
              <WorkoutCard
                key={workout.name}
                disabled={loading}
                item={workout}
                onPress={() => {
                  setWorkoutAction(
                    workout.exercises.map(e => {
                      return {
                        ...exercises[e.exercise],
                        ...e,
                      };
                    }),
                  );
                  navigate('PreWorkout', {name: workout.name});
                }}
              />
            );
          })}
        </>
      ) : (
        <View style={{padding: 10}}>
          <Text
            style={{textAlign: 'center', color: colors.appWhite, fontSize: 20}}>
            No workouts scheduled for today
          </Text>
        </View>
      )}
      {!!tests?.length && (
        <>
          <Text
            style={{
              padding: 5,
              marginLeft: 10,
              color: colors.appWhite,
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            Tests
          </Text>
          {tests.map(test => {
            return (
              <TestCard
                key={test.test}
                item={testsObj[test.test]}
                disabled={loading}
                onPress={() => {
                  navigate('Test', {id: test.test});
                }}
              />
            );
          })}
        </>
      )}
      {(objectHasNonEmptyValues(plan?.sleep) ||
        objectHasNonEmptyValues(plan?.nutrition)) && (
        <>
          <Text
            style={{
              padding: 5,
              marginLeft: 10,
              color: colors.appWhite,
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            Other
          </Text>
          {plan?.nutrition &&
            (plan.nutrition.general ||
              plan.nutrition.preWorkout ||
              plan.nutrition.postWorkout) && (
              <NutritionCard nutrition={plan.nutrition} />
            )}
          {plan?.sleep && plan.sleep.general && (
            <SleepCard sleep={plan.sleep} />
          )}
        </>
      )}
    </ScrollView>
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
