import moment from 'moment';
import React, { useEffect, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import { RootState } from '../../../App';
import { navigate } from '../../../RootNavigation';
import colors from '../../../constants/colors';
import { objectHasNonEmptyValues } from '../../../helpers';
import { getEducationById } from '../../../reducers/education';
import { setWorkout } from '../../../reducers/exercises';
import { getTestsById } from '../../../reducers/tests';
import Education from '../../../types/Education';
import Exercise from '../../../types/Exercise';
import { Plan } from '../../../types/Shared';
import Test from '../../../types/Test';
import EducationCard from '../../commons/EducationCard';
import NutritionCard from '../../commons/NutritionCard';
import SleepCard from '../../commons/SleepCard';
import TestCard from '../../commons/TestCard';
import Text from '../../commons/Text';
import WorkoutCard from '../../commons/WorkoutCard';

const Daily: React.FC<{
  plan?: Plan;
  exercises: { [key: string]: Exercise };
  tests: { [key: string]: Test };
  getTestsById: (ids: string[]) => void;
  loading: boolean;
  setWorkout: (workout: Exercise[]) => void;
  education: { [key: string]: Education };
  getEducationById: (ids: string[]) => void;
  educationLoading: boolean;
}> = ({
  plan,
  exercises,
  tests: testsObj,
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

  useEffect(() => {
    if (plan?.tests) {
      if (testsObj) {
        const missingTestIds = plan.tests.filter(id => !testsObj[id]);
        if (missingTestIds.length) {
          getTestsByIdAction(missingTestIds);
        }
      }
    }
  }, [getTestsByIdAction, testsObj, plan]);

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
          marginVertical: 15,
          color: colors.appWhite,
          fontSize: 25,
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        Today's Plan
      </Text>
      {workouts?.length ? (
        <>
          {workouts.map(workout => {
            return (
              <WorkoutCard
                plan
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
                  if (plan) {
                    navigate('PreWorkout', {
                      planWorkout: workout,
                      planId: plan.id,
                    });
                  }
                }}
              />
            );
          })}
        </>
      ) : (
        <View style={{ padding: 10 }}>
          <Text
            style={{
              textAlign: 'center',
              color: colors.appWhite,
              fontSize: 20,
              marginBottom: 10,
            }}
          >
            No workouts scheduled for today
          </Text>
        </View>
      )}
      {!!plan?.tests?.length && (
        <>
          {plan.tests.map(test => {
            const item = testsObj[test];
            if (item) {
              return (
                <TestCard
                  plan
                  key={item.id}
                  item={item}
                  disabled={loading}
                  onPress={() => {
                    navigate('Test', { id: item.id });
                  }}
                />
              );
            }
            return null;
          })}
        </>
      )}

      {(objectHasNonEmptyValues(plan?.sleep) ||
        objectHasNonEmptyValues(plan?.nutrition)) && (
        <>
          {plan?.nutrition && plan.nutrition.general && (
            <NutritionCard nutrition={plan.nutrition} />
          )}
          {plan?.sleep && plan.sleep.general && (
            <SleepCard sleep={plan.sleep} />
          )}
        </>
      )}
      {!!plan?.education?.length && (
        <>
          {plan.education.map(edu => {
            const item = education[edu];
            if (item) {
              return (
                <EducationCard
                  key={item.id}
                  plan
                  onPress={() =>
                    navigate('EducationArticle', { education: item })
                  }
                  item={item}
                />
              );
            }
            return null;
          })}
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
}: RootState) => ({
  plan: profile.plan,
  exercises: exercises.exercises,
  tests: tests.tests,
  loading: exercises.loading,
  education: education.education,
  educationLoading: education.loading,
});

const mapDispatchToProps = {
  getTestsById,
  setWorkout,
  getEducationById,
};

export default connect(mapStateToProps, mapDispatchToProps)(Daily);
