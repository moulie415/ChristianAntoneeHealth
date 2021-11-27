import {Layout, List, ListItem, Text} from '@ui-kitten/components';
import React, {FunctionComponent, useEffect, useMemo} from 'react';
import {Alert, View} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import {
  getExercisesById,
  getSavedWorkouts,
  setWorkout,
} from '../../../actions/exercises';
import DevicePixels from '../../../helpers/DevicePixels';
import {SavedWorkout} from '../../../types/SavedItem';
import {MyRootState} from '../../../types/Shared';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import ImageOverlay from '../../commons/ImageOverlay';
import {getDifficultyEmoji} from '../../../helpers/exercises';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../../App';
import Exercise from '../../../types/Exercise';

type SavedItemsNavigationProp = StackNavigationProp<
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
}> = ({
  loading,
  savedWorkouts,
  getSavedWorkoutsAction,
  navigation,
  setWorkoutAction,
  exercises,
  getExercisesByIdAction,
}) => {
  useEffect(() => {
    getSavedWorkoutsAction();
  }, [getSavedWorkoutsAction]);

  const missingExercises: string[] = useMemo(() => {
    return Object.values(savedWorkouts).reduce((acc, cur) => {
      const missing = cur.workout.filter(exercise => !exercises[exercise]);
      return [...acc, ...missing];
    }, []);
  }, [exercises, savedWorkouts]);

  useEffect(() => {
    getExercisesByIdAction(missingExercises);
  }, [getExercisesByIdAction, missingExercises]);
  return (
    <>
      <Layout>
        {!missingExercises.length && (
          <List
            data={Object.values(savedWorkouts)}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              return (
                <ListItem
                  onPress={() =>
                    Alert.alert('Retry workout?', '', [
                      {text: 'Cancel', style: 'cancel'},
                      {
                        text: 'Yes',
                        onPress: () => {
                          setWorkoutAction(
                            item.workout.map(id => {
                              return exercises[id];
                            }),
                          );
                          navigation.navigate('ReviewExercises');
                        },
                      },
                    ])
                  }
                  title={moment(item.createddate).format('MMMM Do YYYY')}
                  description={`${item.workout.length} ${
                    item.workout.length > 1 ? 'exercises' : 'exercise'
                  } completed, ${Math.floor(item.calories)} calories expended`}
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

const mapStateToProps = ({exercises}: MyRootState) => ({
  loading: exercises.loading,
  savedWorkouts: exercises.savedWorkouts,
  exercises: exercises.exercises,
});

const mapDispatchToProps = {
  getSavedWorkoutsAction: getSavedWorkouts,
  setWorkoutAction: setWorkout,
  getExercisesByIdAction: getExercisesById,
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedWorkouts);
