import {View, Text} from 'react-native';
import React, {RefObject, useMemo, useState} from 'react';
import colors from '../../constants/colors';
import moment from 'moment';
import Exercise from '../../types/Exercise';
import PagerView from 'react-native-pager-view';
import {MyRootState, PlanWorkout} from '../../types/Shared';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Animated, {FadeIn} from 'react-native-reanimated';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {workoutSong} from '../../sagas/profile';
import Profile from '../../types/Profile';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const ExerciseTimer: React.FC<{
  index: number;
  workout: Exercise[];
  exercise: Exercise;
  pagerRef: RefObject<PagerView>;
  tabIndex: number;
  timerPaused: boolean;
  onTimerPaused: (paused: boolean) => void;
  profile: Profile;
}> = ({
  index,
  workout,
  exercise,
  pagerRef,
  tabIndex,
  timerPaused,
  onTimerPaused,
  profile,
}) => {
  const [key, setKey] = useState<'prep' | 'exercise'>('prep');

  const [finished, setFinished] = useState(false);

  const onComplete = () => {
    if (key === 'exercise' && index < workout.length - 1 && profile.autoPlay) {
      pagerRef.current?.setPage(index + 1);
    } else if (index === workout.length - 1 && key === 'exercise') {
      setFinished(true);
    } else {
      setKey('exercise');
    }
  };

  const onPress = () => {
    onTimerPaused(!timerPaused);
    if (profile.workoutMusic) {
      if (timerPaused) {
        workoutSong.play();
      } else {
        workoutSong.pause();
      }
    }
  };

  const isPrepping = key === 'prep';

  return (
    <AnimatedTouchable
      onPress={onPress}
      disabled={finished}
      entering={FadeIn}
      style={{
        alignSelf: 'center',
        display: tabIndex === 0 ? 'flex' : 'none',
        backgroundColor: finished ? colors.appBlue : 'transparent',
        borderRadius: 100,
      }}>
      <CountdownCircleTimer
        key={key}
        isPlaying={!timerPaused}
        strokeWidth={8}
        size={200}
        onComplete={onComplete}
        trailColor={finished ? colors.muscleSecondary : colors.borderColor}
        duration={key === 'prep' ? profile.prepTime || 15 : exercise.time || 30}
        colors={[colors.appBlue, colors.appBlue, colors.appBlue, colors.appRed]}
        colorsTime={[7, 5, 2, 0]}>
        {({remainingTime}) => {
          const hideTimer = isPrepping && remainingTime >= 10 && index === 0;
          return (
            <View>
              {!hideTimer && !finished && exercise.weight && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 5,
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

              {!finished && !hideTimer && (
                <Icon
                  name={timerPaused ? 'play' : 'pause'}
                  color={colors.appWhite}
                  size={25}
                  style={{
                    alignSelf: 'center',
                    marginBottom: 0,
                    marginLeft: timerPaused ? 10 : 0,
                    textAlign: 'center',
                  }}
                />
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
                      seconds: remainingTime,
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
                  paddingHorizontal: 20,
                }}>
                {isPrepping
                  ? 'GET READY!'
                  : finished
                  ? 'FINISHED!'
                  : `${index + 1}/${workout.length}`}
              </Text>
            </View>
          );
        }}
      </CountdownCircleTimer>
    </AnimatedTouchable>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(ExerciseTimer);
