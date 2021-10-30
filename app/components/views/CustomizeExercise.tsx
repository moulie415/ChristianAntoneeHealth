import {Text, Button, Layout, Spinner, Divider} from '@ui-kitten/components';
import React, {useMemo, useState} from 'react';
// @ts-ignore
import Body from 'react-native-body-highlighter';
import Snackbar from 'react-native-snackbar';
import {Dimensions, ScrollView, View} from 'react-native';
import CustomizeExerciseProps from '../../types/views/CustomExercise';
import Carousel from 'react-native-snap-carousel';
import {MuscleHighlight} from '../../types/Exercise';
import {MyRootState} from '../../types/Shared';
import {downloadVideo, setWorkout} from '../../actions/exercises';
import {connect} from 'react-redux';
import {
  mapMuscleToHighlight,
  muscleReadableString,
} from '../../helpers/exercises';
import {useEffect} from 'react';
import ExerciseVideo from '../commons/ExerciseVideo';
import {getVideoHeight} from '../../helpers';
import DevicePixels from '../../helpers/DevicePixels';
import colors from '../../constants/colors';
import globalStyles from '../../styles/globalStyles';
import Chip from '../commons/Chip';

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

  const muscles = useMemo(() => {
    const arr = [];
    if (exercise.muscles) {
      arr.push(
        ...mapMuscleToHighlight(exercise.muscles).map(m => {
          return {slug: m, intensity: 1};
        }),
      );
    }
    if (exercise.musclesSecondary) {
      arr.push(
        ...mapMuscleToHighlight(exercise.musclesSecondary).map(m => {
          return {slug: m, intensity: 2};
        }),
      );
    }
    return arr;
  }, [exercise.muscles, exercise.musclesSecondary]);

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
        data={[0, 1, 2]}
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
              {item === 0 && !!muscles && (
                <Layout
                  style={{
                    borderRadius: 10,
                    backgroundColor: '#fff',
                    height: DevicePixels[300],
                    padding: DevicePixels[10],
                  }}>
                  <Text category="h5">Muscles worked</Text>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{marginRight: DevicePixels[10]}}>
                      <Text>Primary:</Text>
                      <View style={{flexDirection: 'row'}}>
                        {exercise.muscles.map(muscle => (
                          <View
                            key={muscle}
                            style={{
                              backgroundColor: colors.appBlue,
                              padding: 2,
                              paddingHorizontal: 5,
                              borderRadius: 10,
                              marginTop: 2,
                              marginRight: 5,
                            }}>
                            <Text
                              style={{
                                color: '#fff',
                                fontSize: 10,
                                textAlign: 'center',
                              }}>
                              {muscleReadableString(muscle).toUpperCase()}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    {exercise.musclesSecondary && (
                      <View>
                        <Text>Secondary: </Text>
                        <View style={{flexDirection: 'row'}}>
                          {exercise.musclesSecondary.map(muscle => (
                            <View
                              key={muscle}
                              style={{
                                backgroundColor: colors.appLightBlue,
                                padding: 2,
                                paddingHorizontal: 5,
                                borderRadius: 10,
                                marginTop: 2,
                                marginRight: 5,
                              }}>
                              <Text
                                style={{
                                  color: '#fff',
                                  fontSize: 10,
                                  textAlign: 'center',
                                }}>
                                {muscleReadableString(muscle).toUpperCase()}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                  <Layout
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: DevicePixels[20],
                    }}>
                    <Body
                      scale={1}
                      data={muscles}
                      colors={[colors.appBlue, colors.appLightBlue]}
                    />
                  </Layout>
                </Layout>
              )}
              {item === 1 && !!muscles && !!muscles.length && (
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
              {item === 2 && !!muscles && !!muscles.length && (
                <Layout
                  style={{
                    borderRadius: 10,
                    backgroundColor: '#fff',
                    height: DevicePixels[300],
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                />
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
