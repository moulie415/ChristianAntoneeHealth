import {ListItem, Text, Button} from '@ui-kitten/components';
import React, {useState} from 'react';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import Body from 'react-native-body-highlighter';
import convertToProxyURL from 'react-native-video-cache';
import Snackbar from 'react-native-snackbar';
import {Platform, ScrollView, View} from 'react-native';
import colors from '../../constants/colors';
import CustomizeExerciseProps from '../../types/views/CustomExercise';
import CustomDivider from '../commons/CustomDivider';
import Exercise, {MuscleHighlight} from '../../types/Exercise';
import {MyRootState} from '../../types/Shared';
import {setWorkout} from '../../actions/exercises';
import {connect} from 'react-redux';
import ViewMore from '../commons/ViewMore';
import {SAMPLE_VIDEO_LINK} from '../../constants/strings';
import {mapMuscleToHighlight} from '../../helpers/exercises';

const CustomizeExercise: React.FC<CustomizeExerciseProps> = ({
  route,
  workout,
  setWorkoutAction,
  navigation,
}) => {
  const {exercise} = route.params;
  const [reps, setReps] = useState(15);
  const [sets, setSets] = useState(3);
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
    <ScrollView style={{backgroundColor: colors.appBlack, flex: 1}}>
      {Platform.OS === 'ios' ? (
        <Video
          source={{uri: convertToProxyURL(SAMPLE_VIDEO_LINK)}}
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
          source={{uri: convertToProxyURL(SAMPLE_VIDEO_LINK)}}
        />
      )}
      <Text category="h5" style={{textAlign: 'center', marginBottom: 10}}>
        {exercise.name}
      </Text>

      <CustomDivider />
      <ViewMore text={exercise.description} />
      <CustomDivider />
      {!!muscles && !!muscles.length && (
        <View style={{alignItems: 'center', marginVertical: 20}}>
          <Body scale={1} data={muscles} />
        </View>
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
});

const mapDispatchToProps = {
  setWorkoutAction: setWorkout,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomizeExercise);
