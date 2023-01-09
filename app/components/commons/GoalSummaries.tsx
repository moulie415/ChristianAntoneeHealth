import {View, TouchableOpacity} from 'react-native';
import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import PagerView from 'react-native-pager-view';
import DevicePixels from '../../helpers/DevicePixels';
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Text from './Text';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Goal, MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import Profile from '../../types/Profile';
import {getWeeklyItems} from '../../actions/profile';
import {WeeklyItems} from '../../reducers/profile';
import QuickRoutine from '../../types/QuickRoutines';

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
  const [fill, setFill] = useState((100 / goal) * score);
  return (
    <View style={{alignItems: 'center'}}>
      <AnimatedCircularProgress
        style={{alignSelf: 'center'}}
        size={DevicePixels[120]}
        width={DevicePixels[15]}
        backgroundWidth={DevicePixels[5]}
        fill={fill}
        tintColor={colors.appBlue}
        // tintColorSecondary={colors.appBlueFaded}
        backgroundColor={colors.appWhite}
        arcSweepAngle={240}
        rotation={240}
        lineCap="round">
        {fill => (
          <Text
            style={{
              fontSize: fontSize || DevicePixels[30],
              color: colors.appWhite,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {`${score} ${suffix || ''}`}
          </Text>
        )}
      </AnimatedCircularProgress>
      <Text
        style={{
          color: colors.appWhite,
          fontWeight: 'bold',
          fontSize: DevicePixels[16],
        }}>
        {title}
      </Text>
      {!isFirst && (
        <TouchableOpacity
          onPress={() => pagerRef.current.setPage(index - 1)}
          style={{
            position: 'absolute',
            left: DevicePixels[0],
            top: DevicePixels[40],
            padding: DevicePixels[10],
          }}>
          <Icon
            style={{opacity: 0.8}}
            name="chevron-left"
            size={DevicePixels[30]}
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
            top: DevicePixels[40],
            padding: DevicePixels[10],
          }}>
          <Icon
            style={{opacity: 0.8}}
            name="chevron-right"
            size={DevicePixels[30]}
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

  const workoutTitlePrefixString =
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
    savedQuickRoutines.map(({quickRoutineId}) => {
      return quickRoutinesObj[quickRoutineId];
    });

  return (
    <>
      <Text
        style={{
          margin: DevicePixels[20],
          color: colors.appWhite,
          fontWeight: 'bold',
          alignSelf: 'center',
          fontSize: DevicePixels[24],
        }}>
        Weekly Goals
      </Text>
      <PagerView ref={pagerRef} style={{height: DevicePixels[150]}}>
        <GoalCircle
          title="Workouts completed"
          pagerRef={pagerRef}
          index={0}
          score={2}
          goal={workoutGoal}
          isFirst
        />
        <GoalCircle
          title="Minutes spent training"
          pagerRef={pagerRef}
          index={1}
          goal={minsGoal}
          score={35}
          fontSize={DevicePixels[20]}
          suffix={'\nmins'}
        />

        {profile.goal === Goal.WEIGHT_LOSS && (
          <GoalCircle
            title="Calories burned"
            pagerRef={pagerRef}
            index={2}
            goal={3500}
            score={2000}
            fontSize={DevicePixels[20]}
            suffix={'\nkcal'}
            isLast
          />
        )}
        <GoalCircle
          title={`${workoutTitlePrefixString} workouts completed`}
          pagerRef={pagerRef}
          index={2}
          score={5}
          goal={workoutGoal}
        />
      </PagerView>
    </>
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
