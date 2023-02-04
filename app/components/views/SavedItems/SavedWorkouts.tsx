import React, {FunctionComponent, useEffect, useMemo, useRef} from 'react';
import {Alert, FlatList, View} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import {
  getExercisesById,
  getSavedWorkouts,
  setWorkout,
} from '../../../actions/exercises';

import {SavedQuickRoutine, SavedWorkout} from '../../../types/SavedItem';
import {MyRootState} from '../../../types/Shared';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import ImageOverlay from '../../commons/ImageOverlay';
import {getDifficultyEmoji} from '../../../helpers/exercises';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import Exercise from '../../../types/Exercise';
import {
  getQuickRoutinesById,
  getSavedQuickRoutines,
} from '../../../actions/quickRoutines';
import QuickRoutine from '../../../types/QuickRoutines';
import * as _ from 'lodash';
import Text from '../../commons/Text';
import ListItem from '../../commons/ListItem';
import SavedWorkoutCard from '../../commons/SavedWorkoutCard';

type SavedItemsNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'SavedItems'
>;

const SavedWorkouts: FunctionComponent<{
  loading: boolean;
  savedWorkouts: {[key: string]: SavedWorkout};
  navigation: SavedItemsNavigationProp;
  setWorkoutAction: (workout: Exercise[]) => void;
  getSavedWorkoutsAction: () => void;
  exercises: {[key: string]: Exercise};
  getExercisesByIdAction: (ids: string[]) => void;
  getQuickRoutinesByIdAction: (ids: string[]) => void;
  savedQuickRoutines: {[key: string]: SavedQuickRoutine};
  getSavedQuickRoutinesAction: () => void;
  quickRoutines: {[key: string]: QuickRoutine};
}> = ({
  loading,
  savedWorkouts,
  getSavedWorkoutsAction,
  navigation,
  setWorkoutAction,
  exercises,
  getExercisesByIdAction,
  getSavedQuickRoutinesAction,
  savedQuickRoutines,
  quickRoutines,
  getQuickRoutinesByIdAction,
}) => {
  useEffect(() => {
    getSavedWorkoutsAction();
  }, [getSavedWorkoutsAction]);

  useEffect(() => {
    getSavedQuickRoutinesAction();
  }, [getSavedQuickRoutinesAction]);

  const missingExercises: string[] = useMemo(() => {
    return Object.values(savedWorkouts).reduce((acc, cur) => {
      const missing = cur.workout.filter(exercise => !exercises[exercise]);
      return [...acc, ...missing];
    }, []);
  }, [exercises, savedWorkouts]);

  const missingRoutines = useMemo(() => {
    return Object.values(savedQuickRoutines)
      .filter(routine => !quickRoutines[routine.quickRoutineId])
      .map(routine => routine.quickRoutineId);
  }, [quickRoutines, savedQuickRoutines]);

  useEffect(() => {
    if (missingRoutines.length) {
      getQuickRoutinesByIdAction(missingRoutines);
    }
  }, [getQuickRoutinesByIdAction, missingRoutines]);

  useEffect(() => {
    if (missingExercises.length) {
      getExercisesByIdAction(missingExercises);
    }
  }, [getExercisesByIdAction, missingExercises]);

  return (
    <>
      <View>
        {!loading && (
          <FlatList
            data={[
              ...Object.values(savedWorkouts),
              ...Object.values(savedQuickRoutines),
            ].sort((a,b) => moment(b).valueOf() - moment(a).valueOf())}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              return <SavedWorkoutCard item={item} navigation={navigation} />;
            }}
          />
        )}
      </View>
      <AbsoluteSpinner loading={loading} />
    </>
  );
};

const mapStateToProps = ({exercises, quickRoutines}: MyRootState) => ({
  loading: exercises.loading,
  savedWorkouts: exercises.savedWorkouts,
  exercises: exercises.exercises,
  savedQuickRoutines: quickRoutines.savedQuickRoutines,
  quickRoutines: quickRoutines.quickRoutines,
});

const mapDispatchToProps = {
  getSavedWorkoutsAction: getSavedWorkouts,
  setWorkoutAction: setWorkout,
  getExercisesByIdAction: getExercisesById,
  getSavedQuickRoutinesAction: getSavedQuickRoutines,
  getQuickRoutinesByIdAction: getQuickRoutinesById,
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedWorkouts);
