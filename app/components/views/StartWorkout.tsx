import {Button, Input, Text} from '@ui-kitten/components';
import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import {View, ScrollView, Platform, TouchableOpacity} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Image from 'react-native-fast-image';
import VideoPlayer from 'react-native-video-controls';
import Video from 'react-native-video';
import PagerView from 'react-native-pager-view';
import {connect} from 'react-redux';
import colors from '../../constants/colors';
import {MyRootState} from '../../types/Shared';
import StartWorkoutProps from '../../types/views/StartWorkout';
import ViewMore from '../commons/ViewMore';
import {setExerciseNote} from '../../actions/exercises';

const StartWorkout: FunctionComponent<StartWorkoutProps> = ({
  workout,
  navigation,
  exerciseNotes,
  setExerciseNoteAction,
}) => {
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const pagerRef = useRef<PagerView>();
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
    const start = moment().unix();
    const intervalID = setInterval(() => {
      setSeconds(Math.floor(moment().unix() - start));
    }, 1000);
    return () => clearInterval(intervalID);
  }, []);
  return (
    <View style={{backgroundColor: colors.appBlack, flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          margin: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text category="h5">{`Exercise ${index + 1}/${workout.length}`}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Icon name="stopwatch" size={25} color="#fff" />
          <Text style={{marginLeft: 10, width: 70}} category="h5">
            {moment().utc().startOf('day').add({seconds}).format('mm:ss')}
          </Text>
        </View>
      </View>

      <PagerView
        ref={pagerRef}
        onPageSelected={e => {
          setIndex(e.nativeEvent.position);
          setShowNoteInput({});
        }}
        style={{flex: 1}}>
        {workout.map((exercise, index) => {
          return (
            <ScrollView key={exercise.id}>
              <>
                {Platform.OS === 'ios' ? (
                  <Video
                    source={{
                      uri:
                        'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4',
                    }}
                    controls
                    style={{height: 250, marginBottom: 10}}
                    repeat
                  />
                ) : (
                  <VideoPlayer
                    style={{height: 250, marginBottom: 10}}
                    disableVolume
                    disableBack
                    repeat
                    source={{
                      uri:
                        'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4',
                    }}
                  />
                )}
                {workout[index + 1] && (
                  <TouchableOpacity
                    onPress={() => pagerRef.current.setPage(index + 1)}
                    style={{
                      position: 'absolute',
                      right: 5,
                      top: 100,
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
                      top: 100,
                      zIndex: 9,
                      padding: 10,
                    }}>
                    <Icon name="chevron-left" size={30} color="#fff" />
                  </TouchableOpacity>
                )}
              </>
              <View
                style={{
                  marginHorizontal: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{flex: 4}} category="h6">
                  {exercise.name}
                </Text>
                <View style={{flex: 2, alignItems: 'flex-end'}}>
                  <Text>{`${exercise.reps} repetitions`}</Text>
                  <Text>{`x${exercise.sets} sets`}</Text>
                </View>
              </View>
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
                  numberOfLines={3}
                  style={{margin: 10}}
                  textAlignVertical="top"
                  textAlign="left"
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
              {workout[index + 1] && (
                <View style={{margin: 10}}>
                  <Text category="h6" style={{marginBottom: 10}}>
                    Up next
                  </Text>
                  <TouchableOpacity
                    onPress={() => pagerRef.current.setPage(index + 1)}
                    style={{
                      backgroundColor: colors.appGrey,
                      flexDirection: 'row',
                    }}>
                    <Image
                      style={{height: 70, width: 80}}
                      source={require('../../images/old_man_stretching.jpeg')}
                    />
                    <View
                      style={{
                        marginLeft: 20,
                        justifyContent: 'space-evenly',
                        flex: 1,
                      }}>
                      <Text>{workout[index + 1].name}</Text>
                      <Text>{`${workout[index + 1].reps} repetitions x${
                        workout[index + 1].sets
                      } sets`}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              <Button
                onPress={() => navigation.navigate('EndWorkout')}
                style={{margin: 10}}>
                End workout
              </Button>
            </ScrollView>
          );
        })}
      </PagerView>
    </View>
  );
};

const mapStateToProps = ({exercises}: MyRootState) => ({
  workout: exercises.workout,
  exerciseNotes: exercises.exerciseNotes,
});

const mapDispatchToProps = {
  setExerciseNoteAction: setExerciseNote,
};

export default connect(mapStateToProps, mapDispatchToProps)(StartWorkout);
