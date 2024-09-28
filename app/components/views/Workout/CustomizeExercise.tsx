import {RouteProp} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {Dimensions, ScrollView, View} from 'react-native';
import Snackbar from 'react-native-snackbar';
import {connect} from 'react-redux';
import {RootState, StackParamList} from '../../../App';
import {REPS} from '../../../constants';
import {getVideoHeight} from '../../../helpers';
import {setWorkout} from '../../../reducers/exercises';
import Exercise from '../../../types/Exercise';
import {Profile} from '../../../types/Shared';
import Button from '../../commons/Button';
import ExerciseVideo from '../../commons/ExerciseVideo';
import Spinner from '../../commons/Spinner';
import Text from '../../commons/Text';

REPS.shift();

const {width, height} = Dimensions.get('screen');

const CustomizeExercise: React.FC<{
  route: RouteProp<StackParamList, 'CustomizeExercise'>;
  workout: Exercise[];
  setWorkoutAction: (workout: Exercise[]) => void;
  navigation: NativeStackNavigationProp<StackParamList, 'CustomizeExercise'>;
  loading: boolean;
  profile: Profile;
}> = ({route, workout, setWorkoutAction, navigation, loading, profile}) => {
  const {exercise} = route.params;
  const current = workout.find(e => e.id === exercise.id);
  const [reps, setReps] = useState(current?.reps || 15);
  const [sets, setSets] = useState(current?.sets || 3);
  const [fullscreen, setFullScreen] = useState(false);

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
        },
      ]);
      Snackbar.show({text: 'Exercise added'});
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={{flex: 1}}>
      {!loading && exercise.video && exercise.video.src ? (
        <ExerciseVideo
          paused
          path={exercise.video.src}
          fullscreen={fullscreen}
          setFullScreen={setFullScreen}
          setPaused={() => {}}
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

const mapStateToProps = ({exercises, profile}: RootState) => ({
  workout: exercises.workout,
  loading: exercises.videoLoading,
  profile: profile.profile,
});

const mapDispatchToProps = {
  setWorkoutAction: setWorkout,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomizeExercise);
