import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
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
import DevicePixels from '../../../helpers/DevicePixels';
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

const StartWorkout: React.FC<StartWorkoutProps> = ({
  workout,
  navigation,
  exerciseNotes,
  setExerciseNoteAction,
  downloadVideoAction,
  videos,
  loading,
  profile,
  route,
}) => {
  const [index, setIndex] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const pagerRef = useRef<PagerView>();
  const [showModal, setShowModal] = useState(false);
  const textInputRef = useRef<TextInput>();
  const name = route.params?.name;
  const isLast = route.params?.isLast;

  useEffect(() => {
    const start = moment().unix();
    const intervalID = setInterval(() => {
      setSeconds(Math.floor(moment().unix() - start));
    }, 1000);
    return () => clearInterval(intervalID);
  }, []);

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
          marginRight: DevicePixels[5],
        }}>
        <Text
          style={{
            color: colors.appWhite,
            textAlign: 'center',
            marginRight: DevicePixels[5],
            fontSize: DevicePixels[16],
          }}>{`/ resistance scale: ${resistanceScale}`}</Text>
      </View>
    );
  };

  const loadingExercises = !workout || workout.some(e => e === undefined);

  return (
    <View style={{flex: 1}}>
      <Header hasBack absolute />

      {loadingExercises ? (
        <AbsoluteSpinner loading text="Loading exercises..." />
      ) : (
        <PagerView
          ref={pagerRef}
          onPageSelected={e => {
            setIndex(e.nativeEvent.position);
          }}
          style={{flex: 1, paddingHorizontal: 0}}>
          {workout.map((exercise, i) => {
            const next = workout[index + 1];
            return (
              <View key={exercise.id}>
                {!loading && exercise.video ? (
                  <ExerciseVideo paused path={exercise.video.src} />
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

                {workout[i + 1] && (
                  <TouchableOpacity
                    onPress={() => pagerRef.current.setPage(i + 1)}
                    style={{
                      position: 'absolute',
                      right: DevicePixels[5],
                      top: '18%',
                      zIndex: 9,
                      padding: DevicePixels[10],
                    }}>
                    <Icon
                      name="chevron-right"
                      size={DevicePixels[30]}
                      color="#fff"
                    />
                  </TouchableOpacity>
                )}
                {workout[i - 1] && (
                  <TouchableOpacity
                    onPress={() => pagerRef.current.setPage(i - 1)}
                    style={{
                      position: 'absolute',
                      left: DevicePixels[5],
                      top: '18%',
                      zIndex: 9,
                      padding: DevicePixels[10],
                    }}>
                    <Icon
                      name="chevron-left"
                      size={DevicePixels[30]}
                      color="#fff"
                    />
                  </TouchableOpacity>
                )}
                <FastImage
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: getVideoHeight() - DevicePixels[30],
                    borderTopLeftRadius: DevicePixels[30],
                    borderTopRightRadius: DevicePixels[30],
                    overflow: 'hidden',
                  }}
                  source={require('../../../images/old-black-background-grunge.png')}>
                  <ScrollView keyboardShouldPersistTaps="always">
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
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
                            width: DevicePixels[100],
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: DevicePixels[25],
                          }}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 0}}>
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
                            height: DevicePixels[40],
                            width: DevicePixels[100],
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: DevicePixels[25],
                          }}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 0}}>
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
                      <TouchableOpacity
                        style={{}}
                        onPress={() => setTabIndex(2)}>
                        <LinearGradient
                          colors={
                            tabIndex === 2
                              ? [colors.appBlueLight, colors.appBlueDark]
                              : ['transparent', 'transparent']
                          }
                          style={{
                            height: DevicePixels[40],
                            width: DevicePixels[100],
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: DevicePixels[25],
                          }}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 0}}>
                          <Text
                            style={{
                              fontWeight: 'bold',
                              color: '#fff',
                              textAlign: 'center',
                            }}>
                            Notes
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                    <View>
                      {tabIndex === 0 && (
                        <>
                          <Text
                            style={{
                              margin: DevicePixels[10],
                              color: colors.appWhite,
                              fontSize: DevicePixels[20],
                              fontWeight: 'bold',
                            }}>
                            {exercise.name}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              margin: DevicePixels[10],
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
                                  fontSize: DevicePixels[16],
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
                                size={DevicePixels[30]}
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

                      {tabIndex === 2 && (
                        <Input
                          style={{
                            height: DevicePixels[100],
                            textAlignVertical: 'top',
                            margin: DevicePixels[10],
                          }}
                          placeholder="Enter notes here..."
                          multiline
                          value={exerciseNotes[exercise.id]}
                          onChangeText={text =>
                            setExerciseNoteAction(exercise.id, text)
                          }
                        />
                      )}
                    </View>

                    <LinearGradient
                      colors={[colors.secondaryLight, colors.secondaryDark]}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        margin: DevicePixels[10],
                        height: DevicePixels[60],
                        borderRadius: DevicePixels[30],
                        marginBottom: DevicePixels[10],
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: colors.appWhite,
                          fontSize: DevicePixels[20],
                          padding: DevicePixels[15],
                        }}>{`Exercise ${index + 1}/${workout.length}`}</Text>

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
                      </View>
                    </LinearGradient>
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
                                isLast,
                              });
                            },
                          },
                        ]);
                      }}
                      style={{margin: DevicePixels[10]}}
                    />
                  </ScrollView>
                </FastImage>
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
            borderRadius: DevicePixels[10],
          }}>
          <Icon
            style={{alignSelf: 'center', margin: DevicePixels[10]}}
            name="info-circle"
            color={colors.appBlue}
            size={DevicePixels[20]}
          />
          <Text
            style={{
              textAlign: 'center',
              padding: DevicePixels[15],
              paddingTop: 0,
            }}>
            Resistance scale explained
          </Text>
          <ResistanceScaleInfo />
          <Button
            text="OK"
            onPress={() => setShowModal(false)}
            style={{margin: DevicePixels[10]}}
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
  setExerciseNoteAction: setExerciseNote,
  downloadVideoAction: downloadVideo,
};

export default connect(mapStateToProps, mapDispatchToProps)(StartWorkout);
