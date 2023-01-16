import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, TouchableOpacity, Alert, View} from 'react-native';
import moment from 'moment';
import {connect} from 'react-redux';
import {getVideoHeight} from '../../../helpers';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {MyRootState} from '../../../types/Shared';
import QuickRoutineProps from '../../../types/views/QuickRoutine';
import ExerciseVideo from '../../commons/ExerciseVideo';
import colors from '../../../constants/colors';
import DevicePixels from '../../../helpers/DevicePixels';
import {downloadVideo, setExerciseNote} from '../../../actions/exercises';
import PagerView from 'react-native-pager-view';
import MusclesDiagram from '../../commons/MusclesDiagram';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import ViewMore from '../../commons/ViewMore';
import Modal from '../../commons/Modal';
import Button from '../../commons/Button';
import Text from '../../commons/Text';
import Spinner from '../../commons/Spinner';
import Header from '../../commons/Header';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation-locker';
import ExerciseArrows from '../../commons/ExerciseArrows';
import useInterval from '../../../hooks/UseInterval';

const QuickRoutineView: React.FC<QuickRoutineProps> = ({
  downloadVideoAction,
  videos,
  loading,
  route,
  navigation,
  exerciseNotes,
  setExerciseNoteAction,
  exercisesObj,
}) => {
  const {routine} = route.params;
  const [seconds, setSeconds] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const pagerRef = useRef<PagerView>();
  const [routineStarted, setRoutineStarted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hasPressedPlay, setHasPressedPlay] = useState(false);
  const [fullscreen, setFullScreen] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);

  const exercises = useMemo(() => {
    return routine.exerciseIds.map(id => {
      return exercisesObj[id];
    });
  }, [exercisesObj, routine.exerciseIds]);

  useEffect(() => {
    if (routine.instructions || routine.steps) {
      setShowModal(true);
    }
  }, [navigation, routine.instructions, routine.steps]);

  useInterval(() => {
    if (routineStarted && !timerPaused) {
      setSeconds(seconds + 1);
    }
  }, 1000);

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
                Orientation.lockToPortrait();
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
          scrollEnabled={!fullscreen}
          style={{flex: 1, paddingHorizontal: 0}}>
          {exercises.map((exercise, i) => {
            const next = exercises[index + 1];
            return (
              <View key={exercise.id}>
                {!loading && exercise.video ? (
                  <ExerciseVideo
                    paused
                    path={exercise.video.src}
                    videoIndex={i}
                    currentIndex={index}
                    hasPressedPlay={hasPressedPlay}
                    setHasPressedPlay={setHasPressedPlay}
                    fullscreen={fullscreen}
                    setFullScreen={setFullScreen}
                  />
                ) : (
                  <View
                    style={{
                      height: getVideoHeight(),
                      marginBottom: DevicePixels[10],
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                    }}>
                    <Spinner color={colors.appBlue} />
                  </View>
                )}
                <ExerciseArrows
                  exercises={exercises}
                  index={i}
                  pagerRef={pagerRef}
                  fullscreen={fullscreen}
                />
                {!fullscreen && (
                  <View
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      top: getVideoHeight() - DevicePixels[30],
                      borderTopLeftRadius: DevicePixels[30],
                      borderTopRightRadius: DevicePixels[30],
                      overflow: 'hidden',
                      backgroundColor: colors.appGrey,
                    }}>
                    <ScrollView keyboardShouldPersistTaps="always">
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-evenly',
                          alignItems: 'center',
                          marginTop: DevicePixels[30],
                        }}>
                        <TouchableOpacity
                          style={{}}
                          onPress={() => setTabIndex(0)}>
                          <LinearGradient
                            colors={
                              tabIndex === 0
                                ? [colors.appBlueLight, colors.appBlueDark]
                                : ['transparent', 'transparent']
                            }
                            style={{
                              height: DevicePixels[40],
                              paddingHorizontal: DevicePixels[10],
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: DevicePixels[25],
                              backgroundColor:
                                tabIndex === 0
                                  ? colors.textGrey
                                  : colors.appGrey,
                            }}>
                            <Text
                              style={{
                                fontWeight: 'bold',
                                color: '#fff',
                                textAlign: 'center',
                              }}>
                              Description
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{}}
                          onPress={() => setTabIndex(1)}>
                          <LinearGradient
                            colors={
                              tabIndex === 1
                                ? [colors.appBlueLight, colors.appBlueDark]
                                : ['transparent', 'transparent']
                            }
                            style={{
                              height: DevicePixels[40],
                              paddingHorizontal: DevicePixels[10],
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: DevicePixels[25],
                              backgroundColor:
                                tabIndex === 1
                                  ? colors.textGrey
                                  : colors.appGrey,
                            }}>
                            <Text
                              style={{
                                fontWeight: 'bold',
                                color: '#fff',
                                textAlign: 'center',
                              }}>
                              Diagram
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowModal(true)}>
                          <Icon
                            name="info-circle"
                            color={colors.appWhite}
                            size={DevicePixels[30]}
                          />
                        </TouchableOpacity>
                      </View>
                      <View>
                        {tabIndex === 0 && (
                          <>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                margin: DevicePixels[10],
                                marginBottom: 0,
                              }}>
                              <Text
                                style={{
                                  color: colors.appWhite,
                                  fontSize: DevicePixels[20],
                                  fontWeight: 'bold',
                                }}>
                                {exercise.name}
                              </Text>
                            </View>
                            <ViewMore text={exercise.description} lines={5} />
                          </>
                        )}

                        {tabIndex === 1 && i === index && (
                          <MusclesDiagram
                            primary={exercise.muscles}
                            secondary={exercise.musclesSecondary}
                          />
                        )}
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          margin: DevicePixels[10],
                          height: DevicePixels[60],
                          borderRadius: DevicePixels[30],
                          marginBottom: DevicePixels[10],
                          backgroundColor: colors.appGrey,
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            color: colors.appWhite,
                            fontSize: DevicePixels[20],
                            padding: DevicePixels[15],
                          }}>{`Exercise ${index + 1}/${
                          exercises.length
                        }`}</Text>

                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Icon
                            name="stopwatch"
                            size={DevicePixels[20]}
                            color={colors.appWhite}
                          />
                          <Text
                            style={{
                              fontWeight: 'bold',
                              color: colors.appWhite,
                              fontSize: DevicePixels[20],
                              paddingLeft: DevicePixels[5],
                              padding: DevicePixels[15],
                            }}>
                            {moment()
                              .utc()
                              .startOf('day')
                              .add({seconds})
                              .format('mm:ss')}
                          </Text>
                          <TouchableOpacity
                            onPress={() => setTimerPaused(!timerPaused)}>
                            <Icon
                              name={timerPaused ? 'play' : 'pause'}
                              size={DevicePixels[30]}
                              style={{marginRight: DevicePixels[10]}}
                              color={colors.appWhite}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <Button
                        text="End Workout"
                        onPress={() => {
                          Alert.alert('End workout', 'Are you sure?', [
                            {text: 'No', style: 'cancel'},
                            {
                              text: 'Yes',
                              onPress: () => {
                                navigation.navigate('EndQuickRoutine', {
                                  seconds,
                                  routine,
                                });
                              },
                            },
                          ]);
                        }}
                        style={{margin: DevicePixels[10]}}
                      />
                    </ScrollView>
                  </View>
                )}
              </View>
            );
          })}
        </PagerView>
      )}
      <Modal visible={showModal} onRequestClose={() => setShowModal(false)}>
        <View
          style={{
            backgroundColor: colors.appGrey,
            width: '95%',
            alignSelf: 'center',
            borderRadius: DevicePixels[10],
          }}>
          <Icon
            style={{alignSelf: 'center', margin: DevicePixels[10]}}
            name="info-circle"
            color={colors.appWhite}
            size={DevicePixels[30]}
          />
          <Text
            style={{
              textAlign: 'center',
              padding: DevicePixels[15],
              fontSize: DevicePixels[25],
              paddingTop: 0,
              color: colors.appWhite,
              fontWeight: 'bold',
            }}>
            Instructions
          </Text>
          <View style={{marginBottom: DevicePixels[10]}}>
            {routine.steps ? (
              routine.steps.map(step => {
                return (
                  <View
                    key={step}
                    style={{
                      flexDirection: 'row',
                      margin: DevicePixels[10],
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: colors.appWhite,
                        marginRight: DevicePixels[10],
                      }}>
                      ●
                    </Text>
                    <Text style={{color: colors.appWhite, flex: 1}}>
                      {step}
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text
                style={{
                  color: colors.appWhite,
                  marginHorizontal: DevicePixels[20],
                }}>
                {routine.instructions}
              </Text>
            )}
          </View>
          <Button
            text="OK"
            onPress={() => setShowModal(false)}
            style={{
              margin: DevicePixels[10],
            }}
          />
        </View>
      </Modal>
      {/* <MusicButton /> */}
    </View>
  );
};

const mapStateToProps = ({exercises}: MyRootState) => ({
  videos: exercises.videos,
  loading: exercises.videoLoading,
  exerciseNotes: exercises.exerciseNotes,
  exercisesObj: exercises.exercises,
});

const mapDispatchToProps = {
  downloadVideoAction: downloadVideo,
  setExerciseNoteAction: setExerciseNote,
};

export default connect(mapStateToProps, mapDispatchToProps)(QuickRoutineView);
