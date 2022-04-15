import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {Circle} from 'react-native-progress';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../../constants/colors';
import {Divider, Layout, Text} from '@ui-kitten/components';
import {Goal, MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import WeeklyActivityProps from '../../../types/views/WeeklyActivity';
import DevicePixels from '../../../helpers/DevicePixels';
import {getWeeklyItems} from '../../../actions/profile';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import moment from 'moment';
import {getExercisesById} from '../../../actions/exercises';
import Exercise from '../../../types/Exercise';

const WeeklyActivity: React.FC<WeeklyActivityProps> = ({
  profile,
  weeklyItems,
  loading,
  getWeeklyItems: getWeeklyItemsAction,
  routinesLoading,
  quickRoutines,
  exercises,
  getExercisesById: getExercisesByIdAction,
}) => {
  const {goal} = profile;
  useEffect(() => {
    getWeeklyItemsAction();
  }, [getWeeklyItemsAction]);
  const [days, setDays] = useState(0);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [time, setTime] = useState(0);
  useEffect(() => {
    const workoutsTowardsGoal = Object.values(weeklyItems.quickRoutines).filter(
      item => {
        const routine = quickRoutines[item.quickRoutineId];
        return routine && routine.focus === goal;
      },
    );

    const workoutDays = workoutsTowardsGoal.reduce((acc, cur) => {
      const day = moment(cur.createdate).day();
      if (!acc.includes(day)) {
        return [...acc, day];
      }
      return acc;
    }, []);
    const timeSpent = workoutsTowardsGoal.reduce((acc, cur) => {
      return acc + cur.seconds;
    }, 0);
    setDays(workoutDays.length);

    setTime(timeSpent);
  }, [goal, quickRoutines, weeklyItems.quickRoutines]);

  useEffect(() => {
    const exerciseIds: string[] = Object.values(
      weeklyItems.quickRoutines,
    ).reduce((acc, cur) => {
      const routine = quickRoutines[cur.quickRoutineId];
      if (routine) {
        const arr: string[] = [];
        routine.exerciseIds.forEach(id => {
          if (!acc.includes(id)) {
            arr.push(id);
          }
        });
        return [...acc, ...arr];
      }
      return acc;
    }, []);
    const missingExerciseIds = exerciseIds.filter(id => !exercises[id]);
    getExercisesByIdAction(missingExerciseIds);
    const goalExercises: Exercise[] = exerciseIds.reduce((acc, cur) => {
      if (exercises[cur] && exercises[cur].type === goal) {
        return [...acc, cur];
      }
      return acc;
    }, []);
    setExerciseCount(goalExercises.length);
  }, [
    quickRoutines,
    weeklyItems.quickRoutines,
    exercises,
    getExercisesByIdAction,
    goal,
  ]);

  return (
    <Layout style={{flex: 1}}>
      <ScrollView style={{flex: 1}}>
        <Text
          category="s1"
          style={{textAlign: 'center', marginVertical: DevicePixels[20]}}>
          Training days
        </Text>
        <Circle
          strokeCap="round"
          style={{alignSelf: 'center', marginBottom: DevicePixels[20]}}
          size={DevicePixels[125]}
          progress={days / (goal === Goal.STRENGTH ? 3 : 4)}
          thickness={10}
          color={colors.appBlue}
          borderWidth={0}
          unfilledColor={colors.textGrey}>
          <Layout
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'tranparent',
            }}>
            <Text style={{textAlign: 'center'}} category="h4">
              {`${days} ${days === 1 ? 'day' : 'days'}`}
            </Text>
            <Layout
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {/* <Icon
                style={{marginRight: DevicePixels[5]}}
                size={DevicePixels[10]}
                color={colors.appBlue}
                name="arrow-down"
              /> */}
              <Text
                style={{
                  fontSize: DevicePixels[12],
                }}>{`Goal: ${goal === Goal.STRENGTH ? '3' : '4'} days`}</Text>
            </Layout>
          </Layout>
        </Circle>
        <Divider />
        <Text
          category="s1"
          style={{textAlign: 'center', marginVertical: DevicePixels[20]}}>
          {`${
            goal === Goal.STRENGTH ? 'Strength' : 'Fitness'
          } exercises performed`}
        </Text>
        <Circle
          strokeCap="round"
          style={{alignSelf: 'center', marginBottom: DevicePixels[20]}}
          size={DevicePixels[125]}
          progress={exerciseCount / (Goal.STRENGTH ? 24 : 30)}
          thickness={10}
          color={colors.appRed}
          borderWidth={0}
          unfilledColor={colors.textGrey}>
          <Layout
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'tranparent',
            }}>
            <Text style={{textAlign: 'center'}} category="h4">
              {exerciseCount}
            </Text>
            <Layout
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {/* <Icon
                style={{marginRight: DevicePixels[5]}}
                size={DevicePixels[10]}
                color={colors.appBlue}
                name="arrow-down"
              /> */}
              <Text style={{fontSize: DevicePixels[12]}}>{`Goal: ${
                goal === Goal.STRENGTH ? '24' : '30'
              }`}</Text>
            </Layout>
          </Layout>
        </Circle>
        <Divider />
        <Text
          category="s1"
          style={{textAlign: 'center', marginVertical: DevicePixels[20]}}>
          {`Total time spent ${goal} training`}
        </Text>
        <Circle
          strokeCap="round"
          style={{alignSelf: 'center', marginBottom: DevicePixels[20]}}
          size={DevicePixels[125]}
          progress={time / 60 / (goal === Goal.STRENGTH ? 90 : 150)}
          thickness={10}
          color={colors.appGreen}
          borderWidth={0}
          unfilledColor={colors.textGrey}>
          <Layout
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'tranparent',
            }}>
            <Text style={{textAlign: 'center'}} category="h4">
              {moment()
                .utc()
                .startOf('day')
                .add({seconds: time})
                .format('m [mins]')}
            </Text>
            <Layout
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {/* <Icon
                style={{marginRight: DevicePixels[5]}}
                size={DevicePixels[10]}
                color={colors.appBlue}
                name="arrow-down"
              /> */}
              <Text style={{fontSize: DevicePixels[12]}}>{`Goal: ${
                goal === Goal.STRENGTH ? '90' : '150'
              }mins`}</Text>
            </Layout>
          </Layout>
        </Circle>
      </ScrollView>
      <AbsoluteSpinner loading={loading || routinesLoading} />
    </Layout>
  );
};

const mapStateToProps = ({profile, exercises, quickRoutines}: MyRootState) => ({
  profile: profile.profile,
  weeklyItems: profile.weeklyItems,
  loading: profile.loading,
  routinesLoading: exercises.loading,
  quickRoutines: quickRoutines.quickRoutines,
  exercises: exercises.exercises,
});

const mapDispatchToProps = {
  getWeeklyItems,
  getExercisesById,
};

export default connect(mapStateToProps, mapDispatchToProps)(WeeklyActivity);
