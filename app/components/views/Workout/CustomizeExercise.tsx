import React, {useMemo, useState} from 'react';
import Snackbar from 'react-native-snackbar';
import {Dimensions, Platform, ScrollView, View} from 'react-native';
import {Picker} from 'react-native-wheel-pick';
import CustomizeExerciseProps from '../../../types/views/CustomExercise';
import Carousel from 'react-native-snap-carousel';
import {Goal, MyRootState} from '../../../types/Shared';
import {downloadVideo, setWorkout} from '../../../actions/exercises';
import {connect} from 'react-redux';
import {useEffect} from 'react';
import ExerciseVideo from '../../commons/ExerciseVideo';
import {getVideoHeight} from '../../../helpers';

import globalStyles from '../../../styles/globalStyles';
import MusclesDiagram from '../../commons/MusclesDiagram';
import Button from '../../commons/Button';
import Text from '../../commons/Text';
import Spinner from '../../commons/Spinner';
import colors from '../../../constants/colors';
import {REPS, RESISTANCE, SETS} from '../../../constants';

REPS.shift();

const {width, height} = Dimensions.get('screen');

const CustomizeExercise: React.FC<CustomizeExerciseProps> = ({
  route,
  workout,
  setWorkoutAction,
  navigation,
  downloadVideoAction,
  videos,
  loading,
  profile,
}) => {
  const {exercise} = route.params;
  const current = workout.find(e => e.id === exercise.id);
  const [reps, setReps] = useState(current?.reps || 15);
  const [sets, setSets] = useState(current?.sets || 3);
  const [resistance, setResistance] = useState(current?.resistance || 0);
  const video: {src: string; path: string} | undefined = videos[exercise.id];
  const [fullscreen, setFullScreen] = useState(false);

  useEffect(() => {
    downloadVideoAction(exercise.id);
  }, [downloadVideoAction, exercise.id]);

  const selectExercise = () => {
    if (workout.find(e => e.id === exercise.id)) {
      setWorkoutAction(workout.filter(e => e.id !== exercise.id));
      Snackbar.show({text: 'Exercise removed'});
    } else {
      setWorkoutAction([
        ...workout,
        {
          ...exercise,
          reps: String(reps),
          sets: String(sets),
          resistance: String(resistance),
        },
      ]);
      Snackbar.show({text: 'Exercise added'});
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={{flex: 1}}>
      {!loading &&
      video &&
      exercise.video &&
      video.src === exercise.video.src ? (
        <ExerciseVideo
          paused
          path={exercise.video.src}
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
          }}>
          <Spinner />
        </View>
      )}
      <Text
        style={{
          textAlign: 'center',
          margin: 10,
          marginBottom: 0,
        }}>
        {exercise.name}
      </Text>
      <Carousel
        vertical={false}
        data={[0, 1, 2, 3, 4]}
        sliderWidth={width}
        itemWidth={width - 75}
        renderItem={({item}: {item: number}) => {
          return (
            <View
              style={{
                marginVertical: 20,
                borderRadius: 10,
                ...globalStyles.boxShadow,
              }}>
              {item === 0 && !!exercise.muscles && (
                <MusclesDiagram
                  primary={exercise.muscles}
                  secondary={exercise.musclesSecondary}
                />
              )}
              {item === 1 && !!exercise.muscles && !!exercise.muscles.length && (
                <View
                  style={{
                    borderRadius: 10,
                    backgroundColor: '#fff',
                    height: 300,
                    padding: 10,
                  }}>
                  <Text>Description</Text>
                  <Text>{exercise.description}</Text>
                </View>
              )}
              {item === 2 && !!exercise.muscles && !!exercise.muscles.length && (
                <View
                  style={{
                    borderRadius: 10,
                    backgroundColor: '#fff',
                    height: 300,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text>Reps</Text>
                  {/* @ts-ignore */}
                  <Picker
                    style={{
                      height: 200,
                      backgroundColor: 'transparent',
                    }}
                    textColor={colors.appWhite}
                    itemStyle={{color: colors.appWhite}}
                    selectedValue={String(reps)}
                    pickerData={REPS.map(value => {
                      return {
                        label: `${value.toString()} ${
                          value === 1 ? 'rep' : 'reps'
                        }`,
                        value: String(value),
                      };
                    })}
                    onValueChange={val => setReps(Number(val))}
                  />
                </View>
              )}
              {item === 3 && (
                <View
                  style={{
                    borderRadius: 10,
                    backgroundColor: '#fff',
                    height: 300,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text>Sets</Text>
                  {/* @ts-ignore */}
                  <Picker
                    style={{
                      height: 200,
                      backgroundColor: 'transparent',
                    }}
                    textColor={colors.appWhite}
                    itemStyle={{color: colors.appWhite}}
                    selectedValue={String(sets)}
                    pickerData={SETS.map(value => {
                      return {
                        label: `${value.toString()} ${
                          value === 1 ? 'set' : 'sets'
                        }`,
                        value: String(value),
                      };
                    })}
                    onValueChange={val => setSets(Number(val))}
                  />
                </View>
              )}
              {item === 4 && (
                <View
                  style={{
                    borderRadius: 10,
                    backgroundColor: '#fff',
                    height: 300,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text>Resistance</Text>
                  {/* @ts-ignore */}
                  <Picker
                    style={{
                      height: 200,
                      backgroundColor: 'transparent',
                    }}
                    textColor={colors.appWhite}
                    itemStyle={{color: colors.appWhite}}
                    selectedValue={String(resistance)}
                    pickerData={RESISTANCE.map(value => {
                      return {
                        label:
                          value === 0
                            ? 'Bodyweight'
                            : `${value.toString()} ${
                                profile.unit === 'metric' ? 'kg' : 'lbs'
                              }`,
                        value: String(value),
                      };
                    })}
                    onValueChange={val => setResistance(Number(val))}
                  />
                </View>
              )}
            </View>
          );
        }}
      />
      <Button
        text={
          workout.find(e => e.id === exercise.id)
            ? 'Remove exercise'
            : 'Add exercise'
        }
        style={{margin: 10}}
        onPress={selectExercise}
      />
    </ScrollView>
  );
};

const mapStateToProps = ({exercises, profile}: MyRootState) => ({
  workout: exercises.workout,
  videos: exercises.videos,
  loading: exercises.videoLoading,
  profile: profile.profile,
});

const mapDispatchToProps = {
  setWorkoutAction: setWorkout,
  downloadVideoAction: downloadVideo,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomizeExercise);
