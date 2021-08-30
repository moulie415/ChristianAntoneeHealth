import {Button, Input, Layout, Spinner, Text} from '@ui-kitten/components';
import React, {useEffect, useRef, useState} from 'react';
import {Alert, ScrollView, TouchableOpacity} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Image from 'react-native-fast-image';
import PagerView from 'react-native-pager-view';
import {connect} from 'react-redux';
import colors from '../../constants/colors';
import {MyRootState} from '../../types/Shared';
import StartWorkoutProps from '../../types/views/StartWorkout';
import ViewMore from '../commons/ViewMore';
import {downloadVideo, setExerciseNote} from '../../actions/exercises';
import ExerciseVideo from '../commons/ExerciseVideo';
import {getVideoHeight} from '../../helpers';
import Countdown from '../commons/Countdown';

const StartWorkout: React.FC<StartWorkoutProps> = ({
  workout,
  navigation,
  exerciseNotes,
  setExerciseNoteAction,
  downloadVideoAction,
  videos,
  loading,
}) => {
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const pagerRef = useRef<PagerView>();
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState<{[key: string]: boolean}>(
    {},
  );

  const inputRefs = useRef<{[key: string]: Input}>({});

  useEffect(() => {
    const keys = Object.keys(showNoteInput);
    const key = keys.find(k => showNoteInput[k]);
    if (key) {
      inputRefs.current[key].focus();
    }
  }, [showNoteInput]);

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

  return (
    <Layout style={{flex: 1}}>
      <Countdown onComplete={() => setWorkoutStarted(true)} />
      <Layout
        style={{
          flexDirection: 'row',
          margin: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text category="h5">{`Exercise ${index + 1}/${workout.length}`}</Text>
        <Layout style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Icon name="stopwatch" size={25} color="#fff" />
          <Text style={{marginLeft: 10, width: 70}} category="h5">
            {moment().utc().startOf('day').add({seconds}).format('mm:ss')}
          </Text>
        </Layout>
      </Layout>

      <PagerView
        ref={pagerRef}
        onPageSelected={e => {
          setIndex(e.nativeEvent.position);
          setShowNoteInput({});
        }}
        style={{flex: 1}}>
        {workout.map((exercise, index) => {
          const video: {src: string; path: string} | undefined =
            videos[exercise.id];
          const next = workout[index + 1];
          return (
            <ScrollView key={exercise.id}>
              <>
                {!loading &&
                video &&
                exercise.video &&
                video.src === exercise.video.src ? (
                  <ExerciseVideo paused={!workoutStarted} path={video.path} />
                ) : (
                  <Layout
                    style={{
                      height: getVideoHeight(),
                      marginBottom: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Spinner />
                  </Layout>
                )}
                {workout[index + 1] && (
                  <TouchableOpacity
                    onPress={() => pagerRef.current.setPage(index + 1)}
                    style={{
                      position: 'absolute',
                      right: 5,
                      top: '25%',
                      zIndex: 9,
                      padding: 10,
                    }}>
                    <Icon name="chevron-right" size={30} color="#fff" />
                  </TouchableOpacity>
                )}
                {workout[index - 1] && (
                  <TouchableOpacity
                    onPress={() => pagerRef.current.setPage(index - 1)}
                    style={{
                      position: 'absolute',
                      left: 5,
                      top: '25%',
                      zIndex: 9,
                      padding: 10,
                    }}>
                    <Icon name="chevron-left" size={30} color="#fff" />
                  </TouchableOpacity>
                )}
              </>
              <Layout
                style={{
                  marginHorizontal: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{flex: 4}} category="h6">
                  {exercise.name}
                </Text>
                <Layout style={{flex: 2, alignItems: 'flex-end'}}>
                  <Text>{`${exercise.reps} repetitions`}</Text>
                  <Text>{`x${exercise.sets} sets`}</Text>
                </Layout>
              </Layout>
              <ViewMore text={exercise.description} />
              <TouchableOpacity
                onPress={() =>
                  setShowNoteInput({
                    ...showNoteInput,
                    [exercise.id]: true,
                  })
                }
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  margin: 10,
                }}>
                <Icon
                  name={exerciseNotes[exercise.id] ? 'edit' : 'file'}
                  color={colors.appBlue}
                  size={25}
                />
                <Text style={{color: colors.appBlue, marginLeft: 10}}>
                  {`${
                    exerciseNotes[exercise.id] ? 'Edit' : 'Add'
                  } exercise note`}
                </Text>
              </TouchableOpacity>
              {(showNoteInput[exercise.id] || !!exerciseNotes[exercise.id]) && (
                <Input
                  style={{margin: 10}}
                  textStyle={{minHeight: 50}}
                  multiline
                  ref={element => (inputRefs.current[exercise.id] = element)}
                  disabled={!showNoteInput[exercise.id]}
                  value={exerciseNotes[exercise.id]}
                  onChangeText={text =>
                    setExerciseNoteAction(exercise.id, text)
                  }
                  onSubmitEditing={() =>
                    setShowNoteInput({
                      ...showNoteInput,
                      [exercise.id]: false,
                    })
                  }
                />
              )}
              {next && (
                <Layout style={{margin: 10}}>
                  <Text category="h6" style={{marginBottom: 10}}>
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
                      style={{height: 70, width: 90}}
                      source={
                        next.thumbnail
                          ? {uri: next.thumbnail.src}
                          : require('../../images/old_man_stretching.jpeg')
                      }
                    />
                    <Layout
                      style={{
                        marginLeft: 20,
                        justifyContent: 'space-evenly',
                        flex: 1,
                        backgroundColor: colors.button,
                      }}>
                      <Text>{next.name}</Text>
                      <Text>{`${next.reps} repetitions x${next.sets} sets`}</Text>
                    </Layout>
                  </TouchableOpacity>
                </Layout>
              )}
              <Button
                onPress={() => {
                  Alert.alert('End Workout', 'Are you sure?', [
                    {text: 'No', style: 'cancel'},
                    {
                      text: 'Yes',
                      onPress: () => {
                        navigation.navigate('EndWorkout', {seconds});
                      },
                    },
                  ]);
                }}
                style={{margin: 10}}>
                End workout
              </Button>
            </ScrollView>
          );
        })}
      </PagerView>
    </Layout>
  );
};

const mapStateToProps = ({exercises}: MyRootState) => ({
  workout: exercises.workout,
  exerciseNotes: exercises.exerciseNotes,
  videos: exercises.videos,
  loading: exercises.videoLoading,
});

const mapDispatchToProps = {
  setExerciseNoteAction: setExerciseNote,
  downloadVideoAction: downloadVideo,
};

export default connect(mapStateToProps, mapDispatchToProps)(StartWorkout);
