import {RouteProp} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Alert, ScrollView, TouchableOpacity, View} from 'react-native';
import PagerView from 'react-native-pager-view';
import {connect} from 'react-redux';
import {RootState, StackParamList} from '../../../App';
import {FONTS_SIZES} from '../../../constants';
import colors from '../../../constants/colors';
import {getVideoHeight} from '../../../helpers';
import {endWatchWorkout} from '../../../helpers/biometrics';
import playWorkoutSong from '../../../helpers/playWorkoutSong';
import useExerciseEvents from '../../../hooks/UseExerciseEvents';
import useThrottle from '../../../hooks/UseThrottle';
import useWorkoutTimer from '../../../hooks/UseWorkoutTimer';
import {updateProfile} from '../../../reducers/profile';
import {workoutSong} from '../../../sagas/profile';
import Exercise from '../../../types/Exercise';
import {PauseEvent, Profile, UpdateProfilePayload} from '../../../types/Shared';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import Button from '../../commons/Button';
import ExerciseVideo from '../../commons/ExerciseVideo';
import Header from '../../commons/Header';
import Spinner from '../../commons/Spinner';
import Text from '../../commons/Text';
import Toggle from '../../commons/Toggle';
import WorkoutTabs from '../../commons/WorkoutTabs';

const QuickRoutineView: React.FC<{
  videos: {[key: string]: {src: string; path: string}};
  loading: boolean;
  route: RouteProp<StackParamList, 'QuickRoutine'>;
  navigation: NativeStackNavigationProp<StackParamList, 'QuickRoutine'>;
  exerciseNotes: {[key: string]: string};
  exercisesObj: {[key: string]: Exercise};
  autoPlay?: boolean;
  workoutMusic?: boolean;
  updateProfile: (payload: UpdateProfilePayload) => void;
  profile: Profile;
}> = ({
  loading,
  route,
  navigation,
  exercisesObj,
  autoPlay,
  workoutMusic,
  updateProfile: updateProfileAction,
  profile,
}) => {
  const {routine, startTime} = route.params;
  const [tabIndex, setTabIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const [routineStarted, setRoutineStarted] = useState(false);
  const [fullscreen, setFullScreen] = useState(false);
  const [pauseEvents, setPauseEvents] = useState<PauseEvent[]>([]);
  const [paused, setPaused] = useState(false);

  const exercises = useMemo(() => {
    return routine.exerciseIds.map(id => {
      return typeof id === 'string'
        ? exercisesObj[id]
        : {...exercisesObj[id.id], ...id};
    });
  }, [exercisesObj, routine.exerciseIds]);

  useEffect(() => {
    if (workoutMusic && !routine.disableWorkoutMusic) {
      playWorkoutSong();
    }
  }, [workoutMusic, routine.disableWorkoutMusic]);

  const {seconds, setTimerPaused, timerPaused} = useWorkoutTimer(
    1000,
    !routineStarted,
  );

  const {exerciseEvents} = useExerciseEvents(index);

  const loadingExercises = !exercises || exercises.some(e => e === undefined);

  useEffect(() => {
    if (!loadingExercises) {
      setRoutineStarted(true);
    }
  }, [loadingExercises]);

  useEffect(() => {
    if (exercises && exercises[index]) {
      navigation.setOptions({headerTitle: exercises[index].name});
    }
  }, [exercises, index, navigation]);

  const [ap, setAp] = useState(autoPlay);

  useEffect(() => {
    if (ap !== autoPlay) {
      updateProfileAction({autoPlay: ap, disableSnackbar: true});
    }
  }, [ap, updateProfileAction, autoPlay]);

  const endWorkout = useThrottle(async () => {
    const response = await endWatchWorkout();
    navigation.navigate('EndQuickRoutine', {
      seconds,
      routine,
      endTime: new Date(),
      exerciseEvents,
      startTime,
      pauseEvents,
      watchWorkoutData: response,
    });
    if (workoutSong.isPlaying()) {
      workoutSong.stop();
    }
  }, 3000);

  return (
    <View style={{flex: 1}}>
      <Header
        hasBack
        absolute
        customBackPress={() => {
          Alert.alert('Exit workout', 'Are you sure?', [
            {
              text: 'No',
            },
            {
              text: 'Yes',
              onPress: () => {
                navigation.goBack();

                if (workoutSong.isPlaying()) {
                  workoutSong.stop();
                }
                endWatchWorkout();
              },
            },
          ]);
        }}
      />
      {loadingExercises ? (
        <AbsoluteSpinner loading text="Loading exercises..." />
      ) : (
        <PagerView
          ref={pagerRef}
          onPageSelected={e => {
            setIndex(e.nativeEvent.position);
          }}
          offscreenPageLimit={1}
          scrollEnabled={!fullscreen}
          style={{flex: 1, paddingHorizontal: 0}}>
          {exercises.map((exercise, i) => {
            const next = exercises[index + 1];
            return (
              <View key={`${exercise.id}${i}`}>
                {!loading && exercise.video ? (
                  <ExerciseVideo
                    path={exercise.video.src}
                    videoIndex={i}
                    currentIndex={index}
                    fullscreen={fullscreen}
                    setFullScreen={setFullScreen}
                    setPaused={setPaused}
                    paused={paused}
                  />
                ) : (
                  <View
                    style={{
                      height: getVideoHeight(),
                      marginBottom: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                    }}>
                    <Spinner color={colors.appBlue} />
                  </View>
                )}
                {!fullscreen && (
                  <View
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      top: getVideoHeight() - 30,
                      borderTopLeftRadius: 30,
                      borderTopRightRadius: 30,
                      overflow: 'hidden',
                      backgroundColor: colors.appGrey,
                    }}>
                    <ScrollView
                      contentContainerStyle={{paddingBottom: 20}}
                      keyboardShouldPersistTaps="always">
                      <Text
                        style={{
                          marginTop: 20,
                          color: colors.appWhite,
                          fontSize: 20,
                          marginHorizontal: 40,
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }}>
                        {exercise.name}
                      </Text>
                      <WorkoutTabs
                        tabIndex={tabIndex}
                        setTabIndex={setTabIndex}
                        exercise={exercise}
                        profile={profile}
                        i={i}
                        index={index}
                        workout={exercises}
                        disableWorkoutMusic={routine.disableWorkoutMusic}
                        pagerRef={pagerRef}
                        timerPaused={timerPaused}
                        onTimerPaused={p => {
                          setTimerPaused(p);
                          setPauseEvents([
                            ...pauseEvents,
                            {time: new Date(), paused: p},
                          ]);
                          setPaused(p);
                        }}
                      />

                      <View style={{flexDirection: 'row', flex: 1}}>
                        {index === 0 && (
                          <TouchableOpacity
                            onPress={() => setAp(!ap)}
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              alignItems: 'center',
                              backgroundColor: colors.tile,
                              borderRadius: 12,
                              marginLeft: 20,
                              justifyContent: 'space-evenly',
                              height: 50,
                            }}>
                            <Text
                              style={{
                                color: colors.appWhite,
                                fontSize: FONTS_SIZES.SMALL,
                                fontWeight: 'bold',
                              }}>
                              AUTO-PLAY
                            </Text>
                            <Toggle value={ap} onValueChange={setAp} />
                          </TouchableOpacity>
                        )}
                        {index !== 0 && (
                          <Button
                            text="Previous"
                            variant="secondary"
                            onPress={() => pagerRef.current?.setPage(index - 1)}
                            style={{
                              marginLeft: 20,
                              marginHorizontal: 10,
                              flex: 1,
                            }}
                          />
                        )}

                        {index !== exercises.length - 1 && (
                          <Button
                            text="Next"
                            onPress={() => pagerRef.current?.setPage(index + 1)}
                            style={{
                              marginRight: 20,
                              marginHorizontal: index === 0 ? 20 : 10,
                              flex: 1,
                            }}
                          />
                        )}
                        {index === exercises.length - 1 && (
                          <Button
                            text="End Workout"
                            onPress={() => {
                              Alert.alert('End workout', 'Are you sure?', [
                                {text: 'No', style: 'cancel'},
                                {
                                  text: 'Yes',
                                  onPress: endWorkout,
                                },
                              ]);
                            }}
                            style={{
                              marginRight: 20,
                              marginHorizontal: 10,
                              flex: 1,
                            }}
                          />
                        )}
                      </View>
                    </ScrollView>
                  </View>
                )}
              </View>
            );
          })}
        </PagerView>
      )}
    </View>
  );
};

const mapStateToProps = ({exercises, profile}: RootState) => ({
  videos: exercises.videos,
  loading: exercises.videoLoading,
  exerciseNotes: exercises.exerciseNotes,
  exercisesObj: exercises.exercises,
  autoPlay: profile.profile.autoPlay,
  workoutMusic: profile.profile.workoutMusic,
  profile: profile.profile,
});

const mapDispatchToProps = {
  updateProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(QuickRoutineView);
