import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
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
import MusicButton from '../../commons/MusicButton';
import Spinner from '../../commons/Spinner';

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
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const textInputRef = useRef<TextInput>();
  const name = route.params?.name;
  const isLast = route.params?.isLast;
  useEffect(() => {
    downloadVideoAction(workout[index].id);
  }, [index, workout, downloadVideoAction]);

  useEffect(() => {
    if (workoutStarted) {
      const start = moment().unix();
      const intervalID = setInterval(() => {
        setSeconds(Math.floor(moment().unix() - start));
      }, 1000);
      return () => clearInterval(intervalID);
    }
  }, [workoutStarted]);

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
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text
          style={{
            textAlign: 'center',
            marginRight: DevicePixels[5],
          }}>{`/ resistance scale: ${resistanceScale}`}</Text>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <Icon
            name="info-circle"
            color={colors.appBlue}
            size={DevicePixels[20]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <Countdown onComplete={() => setWorkoutStarted(true)} />
      <ScrollView
        contentContainerStyle={{
          minHeight: Dimensions.get('screen').height + DevicePixels[100],
        }}
        keyboardShouldPersistTaps="always">
        <PagerView
          ref={pagerRef}
          onPageSelected={e => {
            setIndex(e.nativeEvent.position);
          }}
          style={{flex: 1, paddingHorizontal: 0}}>
          {workout.map((exercise, index) => {
            const video: {src: string; path: string} | undefined =
              videos[exercise.id];
            const next = workout[index + 1];

            return (
              <View key={exercise.id}>
                {!loading &&
                video &&
                exercise.video &&
                video.src === exercise.video.src ? (
                  <ExerciseVideo paused={!workoutStarted} path={video.path} />
                ) : (
                  <View
                    style={{
                      height: getVideoHeight(),
                      marginBottom: DevicePixels[10],
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Spinner />
                  </View>
                )}
                {workout[index + 1] && (
                  <TouchableOpacity
                    onPress={() => pagerRef.current.setPage(index + 1)}
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
                {workout[index - 1] && (
                  <TouchableOpacity
                    onPress={() => pagerRef.current.setPage(index - 1)}
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
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: DevicePixels[10],
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                    }}>{`${exercise.reps} reps / ${exercise.sets} sets `}</Text>
                  <ResistanceScale resistanceScale={exercise.resistanceScale} />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: DevicePixels[10],
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: tabIndex === 0 ? colors.appBlue : '#fff',
                      padding: DevicePixels[5],
                      width: DevicePixels[100],
                      borderWidth: DevicePixels[1],
                      borderColor: colors.appBlue,
                      borderTopLeftRadius: DevicePixels[5],
                      borderBottomLeftRadius: DevicePixels[5],
                    }}
                    onPress={() => setTabIndex(0)}>
                    <Text
                      style={{
                        color: tabIndex === 0 ? '#fff' : colors.appBlue,
                        textAlign: 'center',
                      }}>
                      Description
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: tabIndex === 1 ? colors.appBlue : '#fff',
                      padding: DevicePixels[5],
                      width: DevicePixels[100],
                      borderWidth: DevicePixels[1],
                      borderColor: colors.appBlue,
                    }}
                    onPress={() => setTabIndex(1)}>
                    <Text
                      style={{
                        color: tabIndex === 1 ? '#fff' : colors.appBlue,
                        textAlign: 'center',
                      }}>
                      Diagram
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: tabIndex === 2 ? colors.appBlue : '#fff',
                      padding: DevicePixels[5],
                      width: DevicePixels[100],
                      borderWidth: DevicePixels[1],
                      borderColor: colors.appBlue,
                      borderTopRightRadius: DevicePixels[5],
                      borderBottomRightRadius: DevicePixels[5],
                    }}
                    onPress={() => setTabIndex(2)}>
                    <Text
                      style={{
                        color: tabIndex === 2 ? '#fff' : colors.appBlue,
                        textAlign: 'center',
                      }}>
                      Notes
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  {tabIndex === 0 && (
                    <ViewMore text={exercise.description} lines={5} />
                  )}
                  {tabIndex === 1 && (
                    <MusclesDiagram
                      primary={exercise.muscles}
                      secondary={exercise.musclesSecondary}
                    />
                  )}
                  {tabIndex === 2 && (
                    <TextInput
                      ref={textInputRef}
                      style={{
                        margin: DevicePixels[10],
                        borderWidth: StyleSheet.hairlineWidth,
                        height: DevicePixels[100],
                        textAlignVertical: 'top',
                        borderRadius: DevicePixels[10],
                        borderColor: colors.appBlue,
                        padding: DevicePixels[10],
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

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    margin: DevicePixels[10],
                    marginBottom: 0,
                  }}>
                  <Text>{`Exercise ${index + 1}/${workout.length}`}</Text>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                      name="stopwatch"
                      size={DevicePixels[15]}
                      color={colors.darkBlue}
                    />
                    <Text style={{marginLeft: DevicePixels[5]}}>
                      {moment()
                        .utc()
                        .startOf('day')
                        .add({seconds})
                        .format('mm:ss')}
                    </Text>
                  </View>
                </View>
                {next && (
                  <Text style={{marginBottom: DevicePixels[10]}}>Up next</Text>
                )}
                {next && (
                  <TouchableOpacity
                    onPress={() => pagerRef.current.setPage(index + 1)}
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      backgroundColor: colors.button,
                    }}>
                    <Image
                      style={{
                        height: DevicePixels[70],
                        width: DevicePixels[90],
                      }}
                      source={
                        next.thumbnail
                          ? {uri: next.thumbnail.src}
                          : require('../../../images/old_man_stretching.jpeg')
                      }
                    />
                    <View
                      style={{
                        marginLeft: DevicePixels[20],
                        justifyContent: 'space-evenly',
                        flex: 1,
                        backgroundColor: colors.button,
                      }}>
                      <Text>{next.name}</Text>
                      <Text>{`${next.reps} reps ${next.sets} sets`}</Text>
                    </View>
                  </TouchableOpacity>
                )}

                <Button
                  text=" End workout"
                  onPress={() => {
                    Alert.alert('End Workout', 'Are you sure?', [
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
              </View>
            );
          })}
        </PagerView>
      </ScrollView>
      <Modal visible={showModal} onBackDropPress={() => setShowModal(false)}>
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
            style={{alignSelf: 'center', margin: DevicePixels[10]}}
          />
        </View>
      </Modal>
      <MusicButton />
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
