import {Text, Button, Layout, Spinner, Divider} from '@ui-kitten/components';
import React, {useMemo, useState} from 'react';
import Snackbar from 'react-native-snackbar';
import {Dimensions, Platform, ScrollView, View} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
import CustomizeExerciseProps from '../../../types/views/CustomExercise';
import Carousel from 'react-native-snap-carousel';
import {Goal, MyRootState} from '../../../types/Shared';
import {downloadVideo, setWorkout} from '../../../actions/exercises';
import {connect} from 'react-redux';
import {useEffect} from 'react';
import ExerciseVideo from '../../commons/ExerciseVideo';
import {getVideoHeight} from '../../../helpers';
import DevicePixels from '../../../helpers/DevicePixels';
import globalStyles from '../../../styles/globalStyles';
import MusclesDiagram from '../../commons/MusclesDiagram';

const REPS = [...Array(101).keys()];
REPS.shift();
const SETS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const RESISTANCE = [...Array(301).keys()];

const PickerItem = Picker.Item;

const {width, height} = Dimensions.get('screen');

const CustomizeExercise: React.FC<CustomizeExerciseProps> = ({
  route,
  workout,
  setWorkoutAction,
  navigation,
  downloadVideoAction,
  videos,
  loading,
}) => {
  const {exercise} = route.params;
  const [reps, setReps] = useState(15);
  const [sets, setSets] = useState(3);
  const [resistance, setResistance] = useState(0);
  const video: {src: string; path: string} | undefined = videos[exercise.id];

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
          reps: Number(reps),
          sets: Number(sets),
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
        <ExerciseVideo path={video.path} />
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
      <Text
        category="h5"
        style={{
          textAlign: 'center',
          marginBottom: DevicePixels[10],
          marginHorizontal: DevicePixels[10],
        }}>
        {exercise.name}
      </Text>
      <Carousel
        vertical={false}
        data={[0, 1, 2, 3, 4]}
        sliderWidth={width}
        itemWidth={width - DevicePixels[75]}
        renderItem={({item}: {item: number}) => {
          return (
            <Layout
              style={{
                marginVertical: DevicePixels[20],
                borderRadius: 10,
                ...globalStyles.boxShadow,
              }}>
              {item === 0 && !!exercise.muscles && (
                <MusclesDiagram exercise={exercise} />
              )}
              {item === 1 && !!exercise.muscles && !!exercise.muscles.length && (
                <Layout
                  style={{
                    borderRadius: 10,
                    backgroundColor: '#fff',
                    height: DevicePixels[300],
                    padding: DevicePixels[10],
                  }}>
                  <Text category="h5">Description</Text>
                  <Text>{exercise.description}</Text>
                </Layout>
              )}
              {item === 2 && !!exercise.muscles && !!exercise.muscles.length && (
                <Layout
                  style={{
                    borderRadius: 10,
                    backgroundColor: '#fff',
                    height: DevicePixels[300],
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text category="h5">Reps</Text>
                  <Picker
                    style={{
                      width: DevicePixels[200],
                      height: DevicePixels[200],
                    }}
                    selectedValue={reps}
                    lineColor="#999999"
                    itemStyle={{
                      fontSize: DevicePixels[15],
                      color: Platform.OS === 'android' ? '#000' : undefined,
                    }}
                    onValueChange={setReps}>
                    {REPS.map(value => {
                      return (
                        <PickerItem
                          label={`${value.toString()} ${
                            value === 1 ? 'rep' : 'reps'
                          }`}
                          value={value}
                          key={value}
                        />
                      );
                    })}
                  </Picker>
                </Layout>
              )}
              {item === 3 && (
                <Layout
                  style={{
                    borderRadius: 10,
                    backgroundColor: '#fff',
                    height: DevicePixels[300],
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text category="h5">Sets</Text>
                  <Picker
                    style={{
                      width: DevicePixels[200],
                      height: DevicePixels[200],
                    }}
                    selectedValue={sets}
                    lineColor="#999999"
                    itemStyle={{
                      fontSize: DevicePixels[15],
                      color: Platform.OS === 'android' ? '#000' : undefined,
                    }}
                    onValueChange={setSets}>
                    {SETS.map(value => (
                      <PickerItem
                        label={`${value.toString()} ${
                          value === 1 ? 'set' : 'sets'
                        }`}
                        value={value}
                        key={value}
                      />
                    ))}
                  </Picker>
                </Layout>
              )}
              {item === 4 && exercise.type === Goal.STRENGTH && (
                <Layout
                  style={{
                    borderRadius: 10,
                    backgroundColor: '#fff',
                    height: DevicePixels[300],
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text category="h5">Resistance</Text>
                  <Picker
                    style={{
                      width: DevicePixels[200],
                      height: DevicePixels[200],
                    }}
                    selectedValue={resistance}
                    lineColor="#999999"
                    itemStyle={{
                      fontSize: DevicePixels[15],
                      color: Platform.OS === 'android' ? '#000' : undefined,
                    }}
                    onValueChange={setResistance}>
                    {RESISTANCE.map(value => (
                      <PickerItem
                        label={
                          value === 0 ? 'Bodyweight' : `${value.toString()} kg`
                        }
                        value={value}
                        key={value}
                      />
                    ))}
                  </Picker>
                </Layout>
              )}
            </Layout>
          );
        }}
      />
      <Button style={{margin: DevicePixels[10]}} onPress={selectExercise}>
        {workout.find(e => e.id === exercise.id)
          ? 'Remove exercise'
          : 'Add exercise'}
      </Button>
    </ScrollView>
  );
};

const mapStateToProps = ({exercises}: MyRootState) => ({
  workout: exercises.workout,
  videos: exercises.videos,
  loading: exercises.videoLoading,
});

const mapDispatchToProps = {
  setWorkoutAction: setWorkout,
  downloadVideoAction: downloadVideo,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomizeExercise);
