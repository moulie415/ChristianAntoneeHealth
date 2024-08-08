import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import * as _ from 'lodash';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import PagerView from 'react-native-pager-view';
import {SvgProps} from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';
import {RootState, StackParamList} from '../../App';
import colors from '../../constants/colors';
import {getStepSamples} from '../../helpers/biometrics';
import {getGoalsData} from '../../helpers/goals';
import {kFormatter} from '../../helpers/kFormatter';
import useInterval from '../../hooks/UseInterval';
import Fire from '../../images/fire.svg';
import Time from '../../images/time.svg';
import {
  WeeklyItems,
  getWeeklyItems,
  getWeeklyItemsForConnection,
} from '../../reducers/profile';
import QuickRoutine, {Equipment} from '../../types/QuickRoutines';
import {Profile} from '../../types/Shared';
import Text from './Text';
import Tile from './Tile';
import WorkoutCard from './WorkoutCard';

interface GoalSet {
  title: string;
  key: string;
  goal: number;
  score: number;
  icon: React.FC<SvgProps>;
}

const GoalCircle: React.FC<{
  title: string;
  goal: number;
  score: number;
  hideGoal?: boolean;
  icon: React.FC<SvgProps>;
}> = ({title, goal, score, icon: Icon, hideGoal}) => {
  const [fill, setFill] = useState(0);

  useEffect(() => {
    setFill((100 / goal) * score);
  }, [setFill, goal, score]);
  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        flexBasis: '33%',
        marginBottom: 10,
      }}>
      <AnimatedCircularProgress
        style={{alignSelf: 'center'}}
        size={80}
        width={9}
        backgroundWidth={7}
        fill={fill}
        tintColor={score >= goal ? colors.appGreen : colors.appBlue}
        // tintColorSecondary={colors.appBlueFaded}
        backgroundColor={colors.textGrey}
        arcSweepAngle={240}
        rotation={240}
        lineCap="round">
        {fill => <Icon />}
      </AnimatedCircularProgress>
      <Text
        style={{
          color: colors.appWhite,
          fontWeight: 'bold',
          fontSize: 14,
          textAlign: 'center',
          alignSelf: 'center',
          marginTop: -10,
        }}>
        {!hideGoal ? `${kFormatter(score)}/${kFormatter(goal)}` : score}
      </Text>
      <Text
        style={{
          color: colors.appWhite,
          fontWeight: 'bold',
          fontSize: 12,
          width: 100,
          marginHorizontal: 10,
          textAlign: 'center',
          alignSelf: 'center',
          marginBottom: 5,
          marginTop: 5,
        }}>
        {title}
      </Text>
    </View>
  );
};

const GoalSummaries: React.FC<{
  profile: Profile;
  getWeeklyItemsAction: () => void;
  getWeeklyItemsForConnectionAction: (uid: string) => void;
  weeklyItems: WeeklyItems;
  quickRoutinesObj: {[key: string]: QuickRoutine};
  connection?: Profile;
  connectionWeeklyItems: {[key: string]: WeeklyItems};
  navigation: NativeStackNavigationProp<
    StackParamList,
    'Profile' | 'ViewProfile'
  >;
}> = ({
  profile: defaultProfile,
  getWeeklyItemsAction,
  getWeeklyItemsForConnectionAction,
  weeklyItems,
  quickRoutinesObj,
  connection,
  connectionWeeklyItems,
  navigation,
}) => {
  const [dailySteps, setDailySteps] = useState(0);
  const getSteps = useCallback(async () => {
    const dailyStepsSamples = await getStepSamples();
    if (dailyStepsSamples) {
      const steps = dailyStepsSamples.reduce((acc, cur) => acc + cur.value, 0);
      if (steps !== dailySteps) {
        setDailySteps(steps);
      }
    }
  }, [dailySteps]);

  useInterval(() => {
    getSteps();
  }, 60000);

  useEffect(() => {
    if (connection) {
      getWeeklyItemsForConnectionAction(connection.uid);
    } else {
      getWeeklyItemsAction();
      getSteps();
    }
  }, [
    getWeeklyItemsAction,
    getWeeklyItemsForConnectionAction,
    connection,
    getSteps,
  ]);

  const profile = connection || defaultProfile;

  const recommendedWorkout = useMemo(() => {
    if (profile) {
      return _.shuffle(
        Object.values(quickRoutinesObj).filter(routine => {
          const allowedEquipment: Equipment[] =
            profile.equipment === 'full'
              ? ['full', 'minimal', 'none']
              : profile.equipment === 'minimal'
              ? ['minimal', 'none']
              : ['none'];

          return (
            routine.area === profile.area &&
            allowedEquipment.includes(routine.equipment) &&
            routine.level === profile.experience
          );
        }),
      )[0];
    }
  }, [profile, quickRoutinesObj]);

  const [index, setIndex] = useState(0);
  const {
    calories,
    mins,
    workoutLevelScore,
    caloriesGoal,
    workoutGoal,
    minsGoal,
    workoutLevelTitleString,
  } = getGoalsData(
    connection ? connectionWeeklyItems[connection.uid] : weeklyItems,
    quickRoutinesObj,
    connection ? connection.targets : profile.targets,
  );

  const goals: GoalSet[] = [
    {
      title: 'Active minutes',
      key: 'mins',
      goal: minsGoal,
      score: mins,
      icon: Time,
    },
    {
      title: `${workoutLevelTitleString} workouts`,
      key: 'workoutLevel',
      icon: () => (
        <Icon
          name="gauge-high"
          size={25}
          color={colors.button}
          style={{
            marginHorizontal: 15,
          }}
        />
      ),
      score: workoutLevelScore,
      goal: workoutGoal,
    },
    {
      title: 'Calories burned',
      key: 'calories',
      goal: caloriesGoal,
      score: Math.round(calories),
      icon: Fire,
    },
  ];

  return (
    <>
      <PagerView
        onPageSelected={e => {
          setIndex(e.nativeEvent.position);
        }}
        style={{
          height: 215,
        }}>
        <Tile
          key="goals"
          style={{
            // width: Dimensions.get('window').width - 40,
            marginBottom: 15,
            alignSelf: 'center',
            padding: 10,
            marginHorizontal: 20,
          }}>
          <Text
            style={{
              color: colors.appWhite,
              fontWeight: 'bold',
              fontSize: 16,
              textAlign: 'center',
              marginVertical: 10,
            }}>
            Weekly Targets
          </Text>
          <View style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap'}}>
            {connection || profile.targets ? (
              goals.map(({goal, score, title, key, icon}) => {
                return (
                  <GoalCircle
                    title={title}
                    key={key}
                    icon={icon}
                    goal={goal}
                    score={score}
                  />
                );
              })
            ) : (
              <Text style={{color: colors.appWhite, textAlign: 'center'}}>
                Weekly targets will show up here once they have been set by
                Christian
              </Text>
            )}
          </View>
        </Tile>
        {!connection && (
          <Tile
            key="dailies"
            style={{
              // width: Dimensions.get('window').width - 40,
              marginBottom: 20,
              alignSelf: 'center',
              padding: 10,
              marginHorizontal: 20,
            }}>
            <Text
              style={{
                color: colors.appWhite,
                fontWeight: 'bold',
                fontSize: 16,
                textAlign: 'center',
                marginVertical: 10,
              }}>
              Daily Challenges
            </Text>
            <View style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap'}}>
              <GoalCircle
                title="Steps"
                icon={() => (
                  <Icon
                    name="shoe-prints"
                    size={25}
                    color={colors.button}
                    style={{
                      marginHorizontal: 15,
                    }}
                  />
                )}
                goal={10000}
                score={dailySteps}
              />
              <GoalCircle
                title="Workout streak"
                icon={Fire}
                score={profile.dailyWorkoutStreak || 0}
                goal={1}
                hideGoal
              />
            </View>
          </Tile>
        )}
        {!connection && (
          <Tile
            style={{
              paddingTop: 10,
              marginHorizontal: 20,
              marginBottom: 10,
            }}>
            <Text
              style={{
                color: colors.appWhite,
                fontWeight: 'bold',
                fontSize: 16,
                textAlign: 'center',
                marginTop: 10,
                marginBottom: 20,
              }}>
              Recommended workout
            </Text>
            {recommendedWorkout && (
              <WorkoutCard
                item={recommendedWorkout}
                onPress={() =>
                  navigation.navigate('PreQuickRoutine', {
                    routine: recommendedWorkout,
                  })
                }
              />
            )}
          </Tile>
        )}
      </PagerView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 20,
        }}>
        {(connection ? [0] : [0, 1, 2]).map(i => {
          return (
            <View
              key={i}
              style={{
                backgroundColor:
                  i === index ? colors.appWhite : colors.textGrey,
                height: 8,
                width: 8,
                borderRadius: 4,
                marginHorizontal: 3,
              }}
            />
          );
        })}
      </View>
    </>
  );
};

const mapStateToProps = ({profile, quickRoutines}: RootState) => ({
  profile: profile.profile,
  weeklyItems: profile.weeklyItems,
  connectionWeeklyItems: profile.connectionWeeklyItems,
  quickRoutinesObj: quickRoutines.quickRoutines,
});

const mapDispatchToProps = {
  getWeeklyItemsAction: getWeeklyItems,
  getWeeklyItemsForConnectionAction: getWeeklyItemsForConnection,
};

export default connect(mapStateToProps, mapDispatchToProps)(GoalSummaries);
