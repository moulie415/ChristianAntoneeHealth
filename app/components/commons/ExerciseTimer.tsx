import {View, Text} from 'react-native';
import React, {RefObject, useState} from 'react';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import colors from '../../constants/colors';
import moment from 'moment';
import Exercise from '../../types/Exercise';
import useInterval from '../../hooks/UseInterval';
import PagerView from 'react-native-pager-view';

const PREP_TIME = 15;

const ExerciseTimer: React.FC<{
  index: number;
  workout: Exercise[];
  exercise: Exercise;
  pagerRef: RefObject<PagerView>;
  tabIndex: number;
}> = ({index, workout, exercise, pagerRef, tabIndex}) => {
  const [prepTime, setPrepTime] = useState(PREP_TIME);

  const [exerciseTime, setExerciseTime] = useState(exercise.time || 30);

  const isPrepping = prepTime > 0;

  useInterval(() => {
    if (prepTime > 0) {
      setPrepTime(prepTime - 1);
    } else if (exerciseTime > 0) {
      setExerciseTime(exerciseTime - 1);
    } else {
      if (index < workout.length - 1) {
        pagerRef.current?.setPage(index + 1);
      }
    }
  }, 1000);

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
    <AnimatedCircularProgress
      style={{
        display: tabIndex === 0 ? 'flex' : 'none',
        alignSelf: 'center',
        transform: [{scaleX: -1}],
        backgroundColor: finished ? colors.appBlue : 'transparent',
        borderRadius: 100,
      }}
      size={200}
      width={12}
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
                .add({seconds: prepTime || exerciseTime})
                .format('mm:ss')}
            </Text>
          )}
          <Text
            style={{
              fontWeight: 'bold',
              color: colors.appWhite,
              fontSize: hideTimer || finished ? 30 : 16,
              textAlign: 'center',
              padding: 10,
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
  );
};

export default ExerciseTimer;
