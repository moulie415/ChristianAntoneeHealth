import {View, Text} from 'react-native';
import React, {RefObject, useMemo, useState} from 'react';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import colors from '../../constants/colors';
import moment from 'moment';
import Exercise from '../../types/Exercise';
import useInterval from '../../hooks/UseInterval';
import PagerView from 'react-native-pager-view';
import {MyRootState, PlanWorkout} from '../../types/Shared';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Animated, {FadeIn} from 'react-native-reanimated';

const INTERVAL = 100;
const ExerciseTimer: React.FC<{
  index: number;
  workout: Exercise[];
  exercise: Exercise;
  pagerRef: RefObject<PagerView>;
  tabIndex: number;
  autoPlay: boolean;
  prepTime: number;
}> = ({
  index,
  workout,
  exercise,
  pagerRef,
  tabIndex,
  autoPlay,
  prepTime: PREP_TIME,
}) => {
  const startTime = useMemo(() => moment().valueOf(), []);

  const [milliseconds, setMilliseconds] = useState(0);

  const prepTime = PREP_TIME - milliseconds / 1000;

  const exerciseTime = PREP_TIME + (exercise.time || 30) - milliseconds / 1000;

  const isPrepping = prepTime > 0;

  useInterval(() => {
    const diff = moment().valueOf() - startTime;

    setMilliseconds(diff);

    if (exerciseTime < 0 && index < workout.length - 1 && autoPlay) {
      pagerRef.current?.setPage(index + 1);
    }
  }, INTERVAL);

  const getFill = () => {
    if (finished) {
      return 100;
    }
    if (prepTime > 0) {
      return (100 / PREP_TIME) * prepTime;
    } else if (exerciseTime > 0) {
      return (100 / (exercise.time || 30)) * exerciseTime;
    }
    return 0;
  };

  const hideTimer = !!prepTime && PREP_TIME - prepTime <= 5 && index === 0;

  const finished = index === workout.length - 1 && exerciseTime <= 0;

  return (
    <Animated.View entering={FadeIn}>
      <AnimatedCircularProgress
        style={{
          display: tabIndex === 0 ? 'flex' : 'none',
          alignSelf: 'center',
          transform: [{scaleX: -1}],
          backgroundColor: finished ? colors.appBlue : 'transparent',
          borderRadius: 100,
        }}
        size={200}
        width={8}
        backgroundWidth={8}
        fill={getFill()}
        tintColor={finished ? colors.muscleSecondary : colors.appBlue}
        // tintColorSecondary={colors.appBlueFaded}
        backgroundColor={colors.borderColor}
        arcSweepAngle={360}
        rotation={0}
        lineCap="round">
        {fill => (
          <View style={{transform: [{scaleX: -1}]}}>
            {!hideTimer && !finished && exercise.weight && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon color={colors.appWhite} size={15} name="dumbbell" />
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: colors.appWhite,
                    fontSize: 16,
                    textAlign: 'center',
                    marginLeft: 5,
                  }}>
                  {exercise.weight}
                </Text>
              </View>
            )}
            {!hideTimer && !finished && (
              <Text
                style={{
                  fontWeight: 'bold',
                  color: colors.appWhite,
                  fontSize: 40,
                  textAlign: 'center',
                }}>
                {moment()
                  .utc()
                  .startOf('day')
                  .add({
                    seconds: prepTime && prepTime > 0 ? prepTime : exerciseTime,
                  })
                  .format('mm:ss')}
              </Text>
            )}
            <Text
              style={{
                fontWeight: 'bold',
                color: colors.appWhite,
                fontSize: hideTimer || finished ? 30 : 16,
                textAlign: 'center',
                paddingHorizontal: 10,
              }}>
              {isPrepping
                ? 'GET READY!'
                : finished
                ? 'FINISHED!'
                : `${index + 1}/${workout.length}`}
            </Text>
          </View>
        )}
      </AnimatedCircularProgress>
    </Animated.View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  autoPlay: profile.autoPlay,
  prepTime: profile.prepTime,
});

export default connect(mapStateToProps)(ExerciseTimer);
