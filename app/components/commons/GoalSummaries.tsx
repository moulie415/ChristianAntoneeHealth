import {View, TouchableOpacity} from 'react-native';
import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import PagerView from 'react-native-pager-view';
import DevicePixels from '../../helpers/DevicePixels';
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

const GoalCircle: React.FC<{
  isLast?: boolean;
  isFirst?: boolean;
  pagerRef: MutableRefObject<PagerView>;
  index: number;
  title: string;
  goal: number;
  score: number;
  suffix?: string;
  fontSize?: number;
}> = ({
  isLast,
  isFirst,
  pagerRef,
  index,
  title,
  goal,
  score,
  suffix,
  fontSize,
}) => {
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
          fontSize: DevicePixels[25],
          paddingHorizontal: DevicePixels[40],
          textAlign: 'center',
          alignSelf: 'center',
          marginBottom: DevicePixels[30],
        }}>
        {title}
      </Text>
      <AnimatedCircularProgress
        style={{alignSelf: 'center'}}
        size={DevicePixels[200]}
        width={DevicePixels[20]}
        backgroundWidth={DevicePixels[10]}
        fill={fill}
        tintColor={score >= goal ? colors.appGreen : colors.appBlue}
        // tintColorSecondary={colors.appBlueFaded}
        backgroundColor={colors.appWhite}
        arcSweepAngle={240}
        rotation={240}
        lineCap="round">
        {fill => (
          <Text
            style={{
              fontSize: fontSize || DevicePixels[40],
              color: colors.appWhite,
              fontWeight: 'bold',
              textAlign: 'center',
              alignSelf: 'center',
            }}>
            {score + (suffix ? ` ${suffix}` : '')}
          </Text>
        )}
      </AnimatedCircularProgress>
      <Text
        style={{
          color: colors.appWhite,
          fontWeight: 'bold',
          fontSize: DevicePixels[30],
          paddingHorizontal: DevicePixels[40],
          textAlign: 'center',
          alignSelf: 'center',
        }}>
        {`${score}/${goal}`}
      </Text>
      {!isFirst && (
        <TouchableOpacity
          onPress={() => pagerRef.current.setPage(index - 1)}
          style={{
            position: 'absolute',
            left: DevicePixels[0],
            top: '50%',
            padding: DevicePixels[10],
          }}>
          <Icon
            style={{opacity: 0.8}}
            name="chevron-left"
            size={DevicePixels[50]}
            color="#fff"
          />
        </TouchableOpacity>
      )}
      {!isLast && (
        <TouchableOpacity
          onPress={() => pagerRef.current.setPage(index + 1)}
          style={{
            position: 'absolute',
            right: DevicePixels[0],
            top: '50%',
            padding: DevicePixels[10],
          }}>
          <Icon
            style={{opacity: 0.8}}
            name="chevron-right"
            size={DevicePixels[50]}
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
  
  const pagerRef = useRef<PagerView>();

  const workoutGoal = profile.goal === Goal.STRENGTH ? 4 : 3;
  const minsGoal = profile.goal === Goal.WEIGHT_LOSS ? 180 : 150;

  const workoutLevelTitleString =
    profile.goal === Goal.WEIGHT_LOSS
      ? 'Intermediate'
      : profile.goal === Goal.STRENGTH
      ? 'Intermediate/advanced'
      : 'Beginner/intermediate';

  useEffect(() => {
    getWeeklyItemsAction();
  }, [getWeeklyItemsAction]);

  const savedQuickRoutines =
    weeklyItems?.quickRoutines && Object.values(weeklyItems.quickRoutines);

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

  const mins = savedQuickRoutines
    ? Math.round(
        savedQuickRoutines.reduce((acc, cur) => {
          return acc + cur.seconds / 60;
        }, 0),
      )
    : 0;

  const calories = savedQuickRoutines
    ? savedQuickRoutines.reduce((acc, cur) => {
        return acc + cur.calories;
      }, 0)
    : 0;

  const goals = [
    <GoalCircle
      title="Workouts completed"
      pagerRef={pagerRef}
      index={0}
      key="workout"
      score={savedQuickRoutines ? savedQuickRoutines.length : 0}
      goal={workoutGoal}
      isFirst
    />,
    <GoalCircle
      title="Minutes spent training"
      pagerRef={pagerRef}
      index={1}
      key="mins"
      goal={minsGoal}
      score={mins}
      fontSize={DevicePixels[30]}
      suffix={'\nmins'}
    />,

    <GoalCircle
      title={`${workoutLevelTitleString} workouts completed`}
      pagerRef={pagerRef}
      index={2}
      key="workoutLevel"
      score={workoutLevelScore}
      goal={workoutGoal}
      isLast={!(profile.goal === Goal.WEIGHT_LOSS)}
    />,
  ];

  if (profile.goal === Goal.WEIGHT_LOSS) {
    goals.push(
      <GoalCircle
        title="Calories burned"
        pagerRef={pagerRef}
        key="calories"
        index={3}
        goal={3500}
        score={calories}
        fontSize={DevicePixels[30]}
        suffix={'\nkcal'}
        isLast
      />,
    );
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.appGrey,
        flex: 1,
      }}>
      <Header showDrawerMenu />
      <Text
        style={{
          color: colors.appWhite,
          fontWeight: 'bold',
          fontSize: DevicePixels[30],
          textAlign: 'center',
        }}>
        Weekly Goals
      </Text>
      <PagerView ref={pagerRef} style={{flex: 1}}>
        {goals}
      </PagerView>
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
