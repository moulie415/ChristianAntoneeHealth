import {Layout, Text, Spinner, Button} from '@ui-kitten/components';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  View,
  Platform,
} from 'react-native';
import moment from 'moment';
import {connect} from 'react-redux';
import Image from 'react-native-fast-image';
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
  const textInputRef = useRef<TextInput>();

  const exercises = useMemo(() => {
    return routine.exerciseIds.map(id => {
      return exercisesObj[id];
    });
  }, [exercisesObj, routine.exerciseIds]);

  useEffect(() => {
    if (exercisesObj[routine.exerciseIds[index]]) {
      downloadVideoAction(routine.exerciseIds[index]);
    }
  }, [index, downloadVideoAction, routine.exerciseIds, exercisesObj]);

  useEffect(() => {
    if (tabIndex === 2) {
      textInputRef.current?.focus();
    }
  }, [tabIndex]);

  useEffect(() => {
    if (routineStarted) {
      const start = moment().unix();
      const intervalID = setInterval(() => {
        setSeconds(Math.floor(moment().unix() - start));
      }, 1000);
      return () => clearInterval(intervalID);
    }
  }, [routineStarted]);

  const loadingExercises = !exercises || exercises.some(e => e === undefined);

  useEffect(() => {
    if (!loadingExercises) {
      setRoutineStarted(true);
    }
  }, [loadingExercises]);

  useEffect(() => {
    if (exercises && exercises.length) {
      navigation.setOptions({headerTitle: exercises[index].name});
    }
  }, [exercises, index, navigation]);

  return (
    <Layout style={{flex: 1}}>
      {loadingExercises ? (
        <AbsoluteSpinner loading text="Loading exercises..." />
      ) : (
        <PagerView
          ref={pagerRef}
          onPageSelected={e => {
            setIndex(e.nativeEvent.position);
          }}
          style={{flex: 1, paddingHorizontal: 0}}>
          {exercises.map((exercise, i) => {
            const video: {src: string; path: string} | undefined =
              videos[exercise.id];
            const next = exercises[index + 1];
            return (
              <ScrollView keyboardShouldPersistTaps="always" key={exercise.id}>
                <>
                  {!loading &&
                  video &&
                  exercise.video &&
                  video.src === exercise.video.src ? (
                    <ExerciseVideo paused path={video.path} />
                  ) : (
                    <Layout
                      style={{
                        height: getVideoHeight(),
                        marginBottom: DevicePixels[10],
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Spinner />
                    </Layout>
                  )}
                  {exercises[i + 1] && (
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
                  {exercises[i - 1] && (
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
                </>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    margin: DevicePixels[10],
                  }}>
                  <Text category="h5">{`Exercise ${index + 1}/${
                    exercises.length
                  }`}</Text>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                      name="stopwatch"
                      size={DevicePixels[15]}
                      color={colors.darkBlue}
                    />
                    <Text category="h5" style={{marginLeft: DevicePixels[5]}}>
                      {moment()
                        .utc()
                        .startOf('day')
                        .add({seconds})
                        .format('mm:ss')}
                    </Text>
                  </View>
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
                      width: DevicePixels[80],
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
                      width: DevicePixels[80],
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
                      width: DevicePixels[80],
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
                <View style={{height: DevicePixels[275]}}>
                  {tabIndex === 0 && (
                    <ViewMore text={exercise.description} lines={10} />
                  )}

                  {tabIndex === 1 && i === index && (
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
                        borderWidth: DevicePixels[1],
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

                {/* {next && (
                  <Layout style={{margin: DevicePixels[10]}}>
                    <Text
                      category="h6"
                      style={{marginBottom: DevicePixels[10]}}>
                      Up next
                    </Text>
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
                      <Layout
                        style={{
                          marginLeft: DevicePixels[20],
                          justifyContent: 'space-evenly',
                          flex: 1,
                          backgroundColor: colors.button,
                        }}>
                        <Text>{next.name}</Text>
                        <Text>{`${next.reps} repetitions x${next.sets} sets`}</Text>
                      </Layout>
                    </TouchableOpacity>
                  </Layout>
                )} */}
                <Button
                  onPress={() => {
                    Alert.alert('End quick routine', 'Are you sure?', [
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
                  style={{margin: DevicePixels[10]}}>
                  End quick routine
                </Button>
              </ScrollView>
            );
          })}
        </PagerView>
      )}
    </Layout>
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
