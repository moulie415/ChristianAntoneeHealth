import {View, TouchableOpacity} from 'react-native';
import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import PagerView from 'react-native-pager-view';

import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Text from './Text';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Goal, Level, MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import Profile from '../../types/Profile';
import {getWeeklyItems} from '../../actions/profile';
import {WeeklyItems} from '../../reducers/profile';
import QuickRoutine from '../../types/QuickRoutines';
import profileSaga from '../../sagas/profile';
import Goals from '../../styles/views/Goals';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from './Header';
// @ts-ignore
import Confetti from 'react-native-confetti';

interface GoalSet {
  title: string;
  key: string;
  goal: number;
  score: number;
  icon: string;
}

const GoalCircle: React.FC<{
  isLast?: boolean;
  pagerRef: MutableRefObject<PagerView | null>;
  index: number;
  title: string;
  goal: number;
  score: number;
  icon: string;
}> = ({isLast, pagerRef, index, title, goal, score, icon}) => {
  const [fill, setFill] = useState(0);

  useEffect(() => {
    setFill((100 / goal) * score);
  }, [setFill, goal, score]);
  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <Text
        style={{
          color: colors.appWhite,
          fontWeight: 'bold',
          fontSize: 25,
          paddingHorizontal: 40,
          textAlign: 'center',
          alignSelf: 'center',
          marginBottom: 30,
        }}>
        {title}
      </Text>
      <AnimatedCircularProgress
        style={{alignSelf: 'center'}}
        size={200}
        width={20}
        backgroundWidth={10}
        fill={fill}
        tintColor={score >= goal ? colors.appGreen : colors.appBlue}
        // tintColorSecondary={colors.appBlueFaded}
        backgroundColor={colors.textGrey}
        arcSweepAngle={240}
        rotation={240}
        lineCap="round">
        {fill => <Icon name={icon} size={50} color={colors.appWhite} />}
      </AnimatedCircularProgress>
      <Text
        style={{
          color: colors.appWhite,
          fontWeight: 'bold',
          fontSize: 27,
          paddingHorizontal: 40,
          textAlign: 'center',
          alignSelf: 'center',
        }}>
        {`${score}/${goal}`}
      </Text>
      {index !== 0 && (
        <TouchableOpacity
          onPress={() => pagerRef.current?.setPage(index - 1)}
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            padding: 10,
          }}>
          <Icon
            style={{opacity: 0.8}}
            name="chevron-left"
            size={50}
            color="#fff"
          />
        </TouchableOpacity>
      )}
      {!isLast && (
        <TouchableOpacity
          onPress={() => pagerRef.current?.setPage(index + 1)}
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            padding: 10,
          }}>
          <Icon
            style={{opacity: 0.8}}
            name="chevron-right"
            size={50}
            color="#fff"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const GoalSummaries: React.FC<{
  profile: Profile;
  getWeeklyItemsAction: () => void;
  weeklyItems: WeeklyItems;
  quickRoutinesObj: {[key: string]: QuickRoutine};
}> = ({profile, getWeeklyItemsAction, weeklyItems, quickRoutinesObj}) => {
  const pagerRef = useRef<PagerView>(null);

  const workoutGoal = profile.goal === Goal.STRENGTH ? 4 : 3;
  const minsGoal = profile.goal === Goal.WEIGHT_LOSS ? 180 : 150;

  const workoutLevelTitleString =
    profile.goal === Goal.WEIGHT_LOSS
      ? 'Intermediate'
      : profile.goal === Goal.STRENGTH
      ? 'Intermediate/advanced'
      : 'Beginner/intermediate';

  const confettiRef = useRef<Confetti>(null);

  useEffect(() => {
    getWeeklyItemsAction();
  }, [getWeeklyItemsAction]);

  const savedWorkouts = weeklyItems?.workouts
    ? Object.values(weeklyItems.workouts)
    : [];

  const savedQuickRoutines = weeklyItems?.quickRoutines
    ? Object.values(weeklyItems.quickRoutines)
    : [];

  const quickRoutines =
    savedQuickRoutines &&
    savedQuickRoutines
      .map(({quickRoutineId}) => {
        return quickRoutinesObj[quickRoutineId];
      })
      .filter(x => x);

  const workoutLevelScore = quickRoutines
    ? quickRoutines.filter(routine => {
        if (profile.goal === Goal.WEIGHT_LOSS) {
          return routine.level === Level.INTERMEDIATE;
        }
        if (profile.goal === Goal.STRENGTH) {
          return (
            routine.level === Level.INTERMEDIATE ||
            routine.level === Level.ADVANCED
          );
        }
        return (
          routine.level === Level.BEGINNER ||
          routine.level === Level.INTERMEDIATE
        );
      }).length
    : 0;

  const mins = Math.round(
    [...savedWorkouts, ...savedQuickRoutines].reduce((acc, cur) => {
      return acc + cur.seconds / 60;
    }, 0),
  );

  const calories = [...savedWorkouts, ...savedQuickRoutines].reduce(
    (acc, cur) => {
      return acc + (cur.calories || 0);
    },
    0,
  );

  const goals: GoalSet[] = [
    {
      title: 'Workouts completed',
      key: 'workout',
      score: [...savedWorkouts, ...savedQuickRoutines].length,
      goal: workoutGoal,
      icon: 'dumbbell',
    },
    {
      title: 'Minutes spent training',
      key: 'mins',
      goal: minsGoal,
      score: mins,
      icon: 'stopwatch',
    },
    {
      title: `${workoutLevelTitleString} workouts completed`,
      key: 'workoutLevel',
      icon: 'tachometer-alt',
      score: workoutLevelScore,
      goal: workoutGoal,
    },
  ];

  if (profile.goal === Goal.WEIGHT_LOSS) {
    goals.push({
      title: 'Calories burned',
      key: 'calories',
      goal: 3500,
      score: calories,
      icon: 'fire-alt',
    });
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.appGrey,
        flex: 1,
      }}>
      <Header showDrawerMenuButton />
      <Text
        style={{
          color: colors.appWhite,
          fontWeight: 'bold',
          fontSize: 30,
          textAlign: 'center',
        }}>
        Weekly Goals
      </Text>
      <PagerView
        onPageSelected={e => {
          const position = e.nativeEvent.position;
          const {score, goal} = goals[position];
          if (score >= goal) {
            confettiRef.current?.startConfetti();
          } else {
            confettiRef.current?.stopConfetti();
          }
        }}
        ref={pagerRef}
        style={{flex: 1}}>
        {goals.map(({goal, score, title, key, icon}, index) => {
          return (
            <GoalCircle
              pagerRef={pagerRef}
              title={title}
              key={key}
              icon={icon}
              goal={goal}
              score={score}
              index={index}
              isLast={index === goals.length - 1}
            />
          );
        })}
      </PagerView>
      <Confetti ref={confettiRef} duration={3000} confettiCount={200} />
    </SafeAreaView>
  );
};

const mapStateToProps = ({profile, quickRoutines}: MyRootState) => ({
  profile: profile.profile,
  weeklyItems: profile.weeklyItems,
  quickRoutinesObj: quickRoutines.quickRoutines,
});

const mapDispatchToProps = {
  getWeeklyItemsAction: getWeeklyItems,
};

export default connect(mapStateToProps, mapDispatchToProps)(GoalSummaries);
