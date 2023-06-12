import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import {RouteProp} from '@react-navigation/native';
import WorkoutCard from '../../commons/WorkoutCard';
import {setWorkout} from '../../../actions/exercises';
import {connect} from 'react-redux';
import {MyRootState} from '../../../types/Shared';
import Exercise from '../../../types/Exercise';

const MonthlyDayView: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'MonthlyDayView'>;
  route: RouteProp<StackParamList, 'MonthlyDayView'>;
  setWorkout: (workout: Exercise[]) => void;
  exercises: {[key: string]: Exercise};
}> = ({navigation, route, setWorkout: setWorkoutAction, exercises}) => {
  const {workouts} = route.params;
  return (
    <ScrollView>
      {workouts.map(workout => {
        return (
          <WorkoutCard
            plan
            key={workout.name}
            item={workout}
            onPress={() => {
              setWorkoutAction(
                workout.exercises.map(e => {
                  return {
                    ...exercises[e.exercise],
                    ...e,
                  };
                }),
              );
              navigation.navigate('PreWorkout', {planWorkout: workout});
            }}
          />
        );
      })}
    </ScrollView>
  );
};

const mapStateToProps = ({exercises}: MyRootState) => ({
  exercises: exercises.exercises,
});

const mapDispatchToProps = {
  setWorkout,
};

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyDayView);
