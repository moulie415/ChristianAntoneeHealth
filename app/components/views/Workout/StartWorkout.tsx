import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Image from 'react-native-fast-image';
import PagerView from 'react-native-pager-view';
import {connect} from 'react-redux';
import colors from '../../../constants/colors';
import {MyRootState} from '../../../types/Shared';
import StartWorkoutProps from '../../../types/views/StartWorkout';
import {downloadVideo, setExerciseNote} from '../../../actions/exercises';
import ExerciseVideo from '../../commons/ExerciseVideo';
import {getVideoHeight} from '../../../helpers';
import Countdown from '../../commons/Countdown';

import Text from '../../commons/Text';
import MusclesDiagram from '../../commons/MusclesDiagram';
import ViewMore from '../../commons/ViewMore';
import Modal from '../../commons/Modal';
import ResistanceScaleInfo from './ResistanceScaleInfo';
import Button from '../../commons/Button';
import Spinner from '../../commons/Spinner';
import Header from '../../commons/Header';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import LinearGradient from 'react-native-linear-gradient';
import Input from '../../commons/Input';
import FastImage from 'react-native-fast-image';
import Orientation from 'react-native-orientation-locker';
import ExerciseArrows from '../../commons/ExerciseArrows';
import useInterval from '../../../hooks/UseInterval';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Exercise from '../../../types/Exercise';
import {StackParamList} from '../../../App';
import {RouteProp} from '@react-navigation/native';
import Profile from '../../../types/Profile';

const StartWorkout: React.FC<{
  workout: Exercise[];
  exerciseNotes: {[key: string]: string};
  navigation: NativeStackNavigationProp<StackParamList, 'StartWorkout'>;
  route: RouteProp<StackParamList, 'StartWorkout'>;
  downloadVideoAction: (id: string) => void;
  videos: {[key: string]: {src: string; path: string}};
  loading: boolean;
  profile: Profile;
}> = ({
  workout,
  navigation,
  exerciseNotes,
  downloadVideoAction,
  videos,
  loading,
  profile,
  route,
}) => {
  const [index, setIndex] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const [showModal, setShowModal] = useState(false);
  const [hasPressedPlay, setHasPressedPlay] = useState(false);
  const textInputRef = useRef<TextInput>();
  const name = route.params?.name;
  const [fullscreen, setFullScreen] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);

  useInterval(() => {
    if (!timerPaused) {
      setSeconds(seconds + 1);
    }
  }, 1000);

  useEffect(() => {
    if (tabIndex === 2) {
      textInputRef.current?.focus();
    }
  }, [tabIndex]);

  useEffect(() => {
    if (workout[index]) {
      navigation.setOptions({headerTitle: workout[index].name});
    }
  }, [index, navigation, workout]);

  const ResistanceScale: React.FC<{resistanceScale?: string}> = ({
    resistanceScale,
  }) => {
    if (!resistanceScale) {
      return null;
    }
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 5,
        }}>
        <Text
          style={{
            color: colors.appWhite,
            textAlign: 'center',
            marginRight: 5,
            fontSize: 16,
          }}>{`/ resistance scale: ${resistanceScale}`}</Text>
      </View>
    );
  };

  const loadingExercises = !workout || workout.some(e => e === undefined);

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
          {workout.map((exercise, i) => {
            const next = workout[index + 1];

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
                  exercises={workout}
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
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-evenly',
                          alignItems: 'center',
                          marginTop: 30,
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
                              height: 40,
                              width: 100,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 25,
                              backgroundColor:
                                tabIndex === 0
                                  ? colors.textGrey
                                  : colors.appGrey,
                            }}>
                            <Text
                              style={{
                                fontWeight: 'bold',
                                color: colors.appWhite,
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
                              height: 40,
                              width: 100,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 25,
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
                      </View>
                      <View>
                        {tabIndex === 0 && (
                          <>
                            <Text
                              style={{
                                margin: 10,
                                color: colors.appWhite,
                                fontSize: 20,
                                fontWeight: 'bold',
                              }}>
                              {exercise.name}
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                margin: 10,
                                marginVertical: 0,
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'flex-start',
                                }}>
                                <Text
                                  style={{
                                    color: colors.appWhite,
                                    textAlign: 'center',
                                    fontSize: 16,
                                  }}>{`${exercise.reps} reps / ${exercise.sets} sets `}</Text>
                                <ResistanceScale
                                  resistanceScale={exercise.resistanceScale}
                                />
                              </View>
                              <TouchableOpacity
                                onPress={() => setShowModal(true)}>
                                <Icon
                                  name="info-circle"
                                  color={colors.appWhite}
                                  size={30}
                                />
                              </TouchableOpacity>
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
                          margin: 10,
                          height: 60,
                          borderRadius: 30,
                          marginBottom: 10,
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            color: colors.appWhite,
                            fontSize: 20,
                            padding: 15,
                          }}>{`Exercise ${index + 1}/${workout.length}`}</Text>

                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Icon
                            name="stopwatch"
                            size={20}
                            color={colors.appWhite}
                          />
                          <Text
                            style={{
                              fontWeight: 'bold',
                              color: colors.appWhite,
                              fontSize: 20,
                              paddingLeft: 5,
                              padding: 15,
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
                              size={30}
                              style={{marginRight: 10}}
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
                                navigation.navigate('EndWorkout', {
                                  seconds,
                                  name,
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
            backgroundColor: '#fff',
            alignSelf: 'center',
            borderRadius: 10,
          }}>
          <Icon
            style={{alignSelf: 'center', margin: 10}}
            name="info-circle"
            color={colors.appBlue}
            size={20}
          />
          <Text
            style={{
              textAlign: 'center',
              padding: 15,
              paddingTop: 0,
            }}>
            Resistance scale explained
          </Text>
          <ResistanceScaleInfo />
          <Button
            text="OK"
            onPress={() => setShowModal(false)}
            style={{margin: 10}}
          />
        </View>
      </Modal>
      {/* <MusicButton /> */}
    </View>
  );
};

const mapStateToProps = ({exercises, profile}: MyRootState) => ({
  workout: exercises.workout,
  exerciseNotes: exercises.exerciseNotes,
  videos: exercises.videos,
  loading: exercises.videoLoading,
  profile: profile.profile,
});

const mapDispatchToProps = {
  downloadVideoAction: downloadVideo,
};

export default connect(mapStateToProps, mapDispatchToProps)(StartWorkout);
