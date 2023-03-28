import {View, SectionList, Alert} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {
  MyRootState,
  Plan,
  PlanExercise,
  PlanWorkout,
} from '../../../types/Shared';
import {connect} from 'react-redux';
import moment from 'moment';

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
import WorkoutCard from '../../commons/WorkoutCard';
import TestCard from '../../commons/TestCard';

const Weekly: React.FC<{
  plan?: Plan;
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
    if (plan) {
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
    }
  }, [plan]);

  const sections: {title: string; data: PlanWorkout[]}[] = [];

  for (let i = 0; i < 7; i++) {
    if (workouts) {
      const day = moment().add(i, 'days');
      const data = workouts
        .filter(item => {
          return item.dates.some(date => moment(date).isSame(day, 'day'));
        })
        .map(item => {
          return {...item, today: i === 0};
        });
      if (data.length) {
        sections.push({
          title: `${moment(day).format('dddd')} ${i === 0 ? '(today)' : ''}`,
          data,
        });
      }
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

  return (
    <View>
      <SectionList
        sections={sections}
        renderSectionHeader={({section: {title}}) => (
          <Text
            style={{
              padding: 5,
              marginLeft: 10,
              color: colors.appWhite,
              fontWeight: 'bold',
            }}>
            {title}
          </Text>
        )}
        renderItem={({item}) => {
          if ('name' in item) {
            return (
              <WorkoutCard
                plan
                key={item.name}
                item={item}
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
                    navigate('PreWorkout', {name: item.name});
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
                          navigate('PreWorkout', {name: item.name});
                        },
                      },
                    ]);
                  }
                }}
              />
            );
          }
          return null;
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
