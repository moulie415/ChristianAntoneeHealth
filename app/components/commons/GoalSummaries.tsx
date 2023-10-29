import {View, TouchableOpacity, Dimensions} from 'react-native';
import React, {
  MutableRefObject,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import colors from '../../constants/colors';
import Text from './Text';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Goal, Level, MyRootState} from '../../types/Shared';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import Profile from '../../types/Profile';
import {getWeeklyItems} from '../../actions/profile';
import {WeeklyItems} from '../../reducers/profile';
import QuickRoutine from '../../types/QuickRoutines';
import Tile from './Tile';
import {ScrollView} from 'react-native-gesture-handler';
import Dumbbell from '../../images/dumbbell.svg';
import Time from '../../images/time.svg';
import Fire from '../../images/fire.svg';
import {SvgProps} from 'react-native-svg';

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
  icon: React.FC<SvgProps>;
}> = ({title, goal, score, icon: Icon}) => {
  const [fill, setFill] = useState(0);

  useEffect(() => {
    setFill((100 / goal) * score);
  }, [setFill, goal, score]);
  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        flexBasis: '50%',
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
        {`${score}/${goal}`}
      </Text>
      <Text
        style={{
          color: colors.appWhite,
          fontWeight: 'bold',
          fontSize: 12,
          width: 150,
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
  weeklyItems: WeeklyItems;
  quickRoutinesObj: {[key: string]: QuickRoutine};
}> = ({profile, getWeeklyItemsAction, weeklyItems, quickRoutinesObj}) => {
  const workoutGoal = profile.goal === Goal.STRENGTH ? 4 : 3;
  const minsGoal = profile.goal === Goal.WEIGHT_LOSS ? 180 : 150;

  const workoutLevelTitleString =
    profile.goal === Goal.WEIGHT_LOSS
      ? 'Intermediate'
      : profile.goal === Goal.STRENGTH
      ? 'Intermediate'
      : 'Beginner';

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
      icon: Dumbbell,
    },
    {
      title: 'Minutes spent training',
      key: 'mins',
      goal: minsGoal,
      score: mins,
      icon: Time,
    },
    {
      title: `${workoutLevelTitleString} workouts completed`,
      key: 'workoutLevel',
      icon: () => (
        <Icon
          name="tachometer-alt"
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
  ];

  if (profile.goal === Goal.WEIGHT_LOSS) {
    goals.push({
      title: 'Calories burned',
      key: 'calories',
      goal: 3500,
      score: calories,
      icon: Fire,
    });
  }

  return (
    <Tile
      style={{
        width: Dimensions.get('window').width - 40,
        marginBottom: 20,
        alignSelf: 'center',
        padding: 10,
      }}>
      <Text
        style={{
          color: colors.appWhite,
          fontWeight: 'bold',
          fontSize: 16,
          textAlign: 'center',
          marginVertical: 10,
        }}>
        Weekly Goals
      </Text>
      <View style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap'}}>
        {goals.map(({goal, score, title, key, icon}) => {
          return (
            <GoalCircle
              title={title}
              key={key}
              icon={icon}
              goal={goal}
              score={score}
            />
          );
        })}
      </View>
    </Tile>
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
