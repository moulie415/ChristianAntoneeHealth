import {Layout, List, ListItem, Text} from '@ui-kitten/components';
import React, {FunctionComponent, useEffect, useMemo, useRef} from 'react';
import {Alert, View} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import {
  getExercisesById,
  getSavedWorkouts,
  setWorkout,
} from '../../../actions/exercises';
import DevicePixels from '../../../helpers/DevicePixels';
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
      <Layout>
        {!loading && (
          <List
            data={[
              ...Object.values(savedWorkouts),
              ...Object.values(savedQuickRoutines),
            ]}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              if ('workout' in item) {
                return (
                  <ListItem
                    onPress={() => {
                      setWorkoutAction(
                        item.workout.map(id => {
                          return exercises[id];
                        }),
                      );
                      navigation.navigate('StartWorkout', {name: item.name});
                    }}
                    title={`${item.name ? item.name + ' - ' : ''}${moment(
                      item.createdate,
                    ).format('MMMM Do YYYY')}`}
                    description={`${item.workout.length} ${
                      item.workout.length > 1 ? 'exercises' : 'exercise'
                    }, ${Math.floor(item.calories)} calories expended`}
                    accessoryLeft={() => (
                      <ImageOverlay
                        containerStyle={{
                          height: DevicePixels[75],
                          width: DevicePixels[75],
                        }}
                        overlayAlpha={0.4}
                        source={require('../../../images/old_man_stretching.jpeg')}>
                        <View style={{alignItems: 'center'}}>
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: DevicePixels[12],
                            }}>
                            {'Duration '}
                          </Text>
                          <Text category="h6" style={{color: '#fff'}}>
                            {moment()
                              .utc()
                              .startOf('day')
                              .add({seconds: item.seconds})
                              .format('mm:ss')}
                          </Text>
                        </View>
                      </ImageOverlay>
                    )}
                    accessoryRight={() => (
                      <Text style={{fontSize: DevicePixels[30]}}>
                        {getDifficultyEmoji(item.difficulty)}
                      </Text>
                    )}
                  />
                );
              }
              const quickRoutine = quickRoutines[item.quickRoutineId];
              if (!quickRoutine) {
                return null;
              }
              return (
                <ListItem
                  onPress={() => {
                    getExercisesByIdAction(quickRoutine.exerciseIds);
                    navigation.navigate('QuickRoutine', {
                      routine: quickRoutine,
                    });
                  }}
                  title={`${quickRoutine.name} - ${moment(
                    item.createdate,
                  ).format('MMMM Do YYYY')}`}
                  description={`${quickRoutine.exerciseIds?.length} ${
                    quickRoutine.exerciseIds?.length > 1
                      ? 'exercises'
                      : 'exercise'
                  }, ${Math.floor(item.calories)} calories expended`}
                  accessoryLeft={() => (
                    <ImageOverlay
                      containerStyle={{
                        height: DevicePixels[75],
                        width: DevicePixels[75],
                      }}
                      overlayAlpha={0.4}
                      source={
                        quickRoutine.thumbnail
                          ? {uri: quickRoutine.thumbnail.src}
                          : require('../../../images/old_man_stretching.jpeg')
                      }>
                      <View style={{alignItems: 'center'}}>
                        <Text
                          style={{color: '#fff', fontSize: DevicePixels[12]}}>
                          {'Duration '}
                        </Text>
                        <Text category="h6" style={{color: '#fff'}}>
                          {moment()
                            .utc()
                            .startOf('day')
                            .add({seconds: item.seconds})
                            .format('mm:ss')}
                        </Text>
                      </View>
                    </ImageOverlay>
                  )}
                  accessoryRight={() => (
                    <Text style={{fontSize: DevicePixels[30]}}>
                      {getDifficultyEmoji(item.difficulty)}
                    </Text>
                  )}
                />
              );
            }}
          />
        )}
      </Layout>
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
