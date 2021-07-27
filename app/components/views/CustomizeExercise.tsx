import {Text, Button, Layout, Spinner} from '@ui-kitten/components';
import React, {useState} from 'react';
import Video from 'react-native-video';
// @ts-ignore
import VideoPlayer from 'react-native-video-controls';
// @ts-ignore
import Body from 'react-native-body-highlighter';
import Snackbar from 'react-native-snackbar';
import {Alert, Platform, ScrollView} from 'react-native';
import CustomizeExerciseProps from '../../types/views/CustomExercise';
import CustomDivider from '../commons/CustomDivider';
import Exercise, {MuscleHighlight} from '../../types/Exercise';
import {MyRootState} from '../../types/Shared';
import {downloadVideo, setWorkout} from '../../actions/exercises';
import {connect} from 'react-redux';
import ViewMore from '../commons/ViewMore';
import {mapMuscleToHighlight} from '../../helpers/exercises';
import {useEffect} from 'react';
import ExerciseVideo from '../commons/ExerciseVideo';

const CustomizeExercise: React.FC<CustomizeExerciseProps> = ({
  route,
  workout,
  setWorkoutAction,
  navigation,
  downloadVideoAction,
  videos,
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
  const muscles: {slug: MuscleHighlight; intensity: number}[] = exercise.muscles
    ? mapMuscleToHighlight(exercise.muscles).map(m => {
        return {slug: m, intensity: 1};
      })
    : [];
  return (
    <ScrollView style={{flex: 1}}>
      {video && exercise.video && video.src === exercise.video.src ? (
        <ExerciseVideo path={video.path} />
      ) : (
        <Layout
          style={{
            height: 250,
            marginBottom: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Spinner />
        </Layout>
      )}
      <Text category="h5" style={{textAlign: 'center', marginBottom: 10}}>
        {exercise.name}
      </Text>

      <CustomDivider />
      <ViewMore text={exercise.description} />
      <CustomDivider />
      {!!muscles && !!muscles.length && (
        <Layout
          style={{
            alignItems: 'center',
            marginVertical: 20,
            backgroundColor: 'transparent',
          }}>
          <Body scale={1} data={muscles} />
        </Layout>
      )}
      <Button style={{margin: 10}} onPress={selectExercise}>
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
});

const mapDispatchToProps = {
  setWorkoutAction: setWorkout,
  downloadVideoAction: downloadVideo,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomizeExercise);
