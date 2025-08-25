import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import moment from 'moment';
import React, { RefObject, useState } from 'react';
import { View } from 'react-native';
import {
  ColorFormat,
  CountdownCircleTimer,
} from 'react-native-countdown-circle-timer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PagerView from 'react-native-pager-view';
import Animated, { FadeIn } from 'react-native-reanimated';
import { connect } from 'react-redux';
import { RootState } from '../../App';
import colors from '../../constants/colors';
import { workoutSong } from '../../sagas/profile';
import Exercise from '../../types/Exercise';
import { Profile } from '../../types/Shared';
import Text from './Text';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const ExerciseTimer: React.FC<{
  index: number;
  workout: Exercise[];
  exercise: Exercise;
  pagerRef: RefObject<PagerView | null>;
  tabIndex: number;
  timerPaused: boolean;
  onTimerPaused: (paused: boolean) => void;
  profile: Profile;
  disableWorkoutMusic: boolean;
}> = ({
  index,
  workout,
  exercise,
  pagerRef,
  tabIndex,
  timerPaused,
  onTimerPaused,
  profile,
  disableWorkoutMusic,
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
    if (profile.workoutMusic && !disableWorkoutMusic) {
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
      }}
    >
      <CountdownCircleTimer
        key={key}
        isPlaying={!timerPaused}
        strokeWidth={8}
        size={200}
        onComplete={onComplete}
        trailColor={
          finished
            ? (colors.muscleSecondary as ColorFormat)
            : (colors.borderColor as ColorFormat)
        }
        duration={
          key === 'prep'
            ? exercise.prepTime || profile.prepTime || 15
            : exercise.time || 30
        }
        colors={[
          colors.appBlue as `#${string}`,
          colors.appBlue as `#${string}`,
          colors.appBlue as `#${string}`,
          colors.appRed as `#${string}`,
        ]}
        colorsTime={[7, 5, 2, 0]}
      >
        {({ remainingTime }) => {
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
                  }}
                >
                  <FontAwesome6
                    iconStyle="solid"
                    color={colors.appWhite}
                    size={15}
                    name="dumbbell"
                  />
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: colors.appWhite,
                      fontSize: 16,
                      textAlign: 'center',
                      marginLeft: 5,
                    }}
                  >
                    {exercise.weight}
                  </Text>
                </View>
              )}

              {!finished && !hideTimer && (
                <FontAwesome6
                  iconStyle="solid"
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
                  }}
                >
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
                }}
              >
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

const mapStateToProps = ({ profile }: RootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(ExerciseTimer);
