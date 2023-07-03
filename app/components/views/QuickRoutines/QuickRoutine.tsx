import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, TouchableOpacity, Alert, View} from 'react-native';
import moment from 'moment';
import {connect} from 'react-redux';
import {getVideoHeight} from '../../../helpers';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {MyRootState} from '../../../types/Shared';
import ExerciseVideo from '../../commons/ExerciseVideo';
import colors from '../../../constants/colors';
import {setExerciseNote} from '../../../actions/exercises';
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
import {StackParamList} from '../../../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/core';
import Exercise from '../../../types/Exercise';
import WorkoutTabs from '../../commons/WorkoutTabs';
import WorkoutTabFooter from '../../commons/WorkoutTabFooter';
import ResistanceScaleInfo from '../Workout/ResistanceScaleInfo';
import useWorkoutTimer from '../../../hooks/UseWorkoutTimer';

const QuickRoutineView: React.FC<{
  videos: {[key: string]: {src: string; path: string}};
  loading: boolean;
  route: RouteProp<StackParamList, 'QuickRoutine'>;
  navigation: NativeStackNavigationProp<StackParamList, 'QuickRoutine'>;
  setExerciseNoteAction: (exercise: string, note: string) => void;
  exerciseNotes: {[key: string]: string};
  exercisesObj: {[key: string]: Exercise};
}> = ({
  videos,
  loading,
  route,
  navigation,
  exerciseNotes,
  setExerciseNoteAction,
  exercisesObj,
}) => {
  const {routine} = route.params;
  const [tabIndex, setTabIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const [routineStarted, setRoutineStarted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hasPressedPlay, setHasPressedPlay] = useState(false);
  const [fullscreen, setFullScreen] = useState(false);

  const exercises = useMemo(() => {
    return routine.exerciseIds.map(id => {
      return exercisesObj[id];
    });
  }, [exercisesObj, routine.exerciseIds]);

  useEffect(() => {
    if (routine.instructions || routine.steps) {
      setShowModal(true);
    }
  }, [routine.instructions, routine.steps]);

  const {seconds, setTimerPaused, timerPaused} = useWorkoutTimer(
    1000,
    !routineStarted,
  );

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

  const [showResistanceModal, setShowResistanceModal] = useState(false);

  return (
    <View style={{flex: 1}}>
      <Header
        hasBack
        absolute
        right={
          routine.steps ? (
            <TouchableOpacity
              style={{marginTop: 10}}
              onPress={() => setShowModal(true)}>
              <Icon name="info-circle" color={colors.appWhite} size={30} />
            </TouchableOpacity>
          ) : null
        }
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
                      marginBottom: 10,
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
                      top: getVideoHeight() - 30,
                      borderTopLeftRadius: 30,
                      borderTopRightRadius: 30,
                      overflow: 'hidden',
                      backgroundColor: colors.appGrey,
                    }}>
                    <ScrollView keyboardShouldPersistTaps="always">
                      <Text
                        style={{
                          marginTop: 20,
                          color: colors.appWhite,
                          fontSize: 20,
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }}>
                        {exercise.name}
                      </Text>
                      <WorkoutTabs
                        tabIndex={tabIndex}
                        setTabIndex={setTabIndex}
                        exercise={exercise}
                        i={i}
                        index={index}
                        setShowResistanceModal={setShowResistanceModal}
                      />

                      <WorkoutTabFooter
                        seconds={seconds}
                        setTimerPaused={setTimerPaused}
                        timerPaused={timerPaused}
                        workout={exercises}
                        index={index}
                      />
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
                                  endTime: new Date(),
                                });
                              },
                            },
                          ]);
                        }}
                        style={{margin: 10}}
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
            borderRadius: 10,
          }}>
          <Icon
            style={{alignSelf: 'center', margin: 10}}
            name="info-circle"
            color={colors.appWhite}
            size={30}
          />
          <Text
            style={{
              textAlign: 'center',
              padding: 15,
              fontSize: 25,
              paddingTop: 0,
              color: colors.appWhite,
              fontWeight: 'bold',
            }}>
            Instructions
          </Text>
          <View style={{marginBottom: 10}}>
            {routine.steps ? (
              routine.steps.map(step => {
                return (
                  <View
                    key={step}
                    style={{
                      flexDirection: 'row',
                      margin: 10,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: colors.appWhite,
                        marginRight: 10,
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
                  marginHorizontal: 20,
                }}>
                {routine.instructions}
              </Text>
            )}
          </View>
          <Button
            text="OK"
            onPress={() => setShowModal(false)}
            style={{
              margin: 10,
            }}
          />
        </View>
      </Modal>
      <Modal
        visible={showResistanceModal}
        onRequestClose={() => setShowResistanceModal(false)}>
        <View
          style={{
            backgroundColor: '#fff',
            alignSelf: 'center',
            borderRadius: 10,
          }}>
          <Text
            style={{
              textAlign: 'center',
              padding: 15,
            }}>
            Resistance scale explained
          </Text>
          <ResistanceScaleInfo />
          <Button
            text="OK"
            onPress={() => setShowResistanceModal(false)}
            style={{margin: 10}}
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
  setExerciseNoteAction: setExerciseNote,
};

export default connect(mapStateToProps, mapDispatchToProps)(QuickRoutineView);
