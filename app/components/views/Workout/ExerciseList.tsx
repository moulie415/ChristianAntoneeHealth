import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useMemo} from 'react';
import {Image, RefreshControl, StyleSheet, TouchableOpacity, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';
import {RootState, StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import {truncate} from '../../../helpers';
import {setWorkout} from '../../../reducers/exercises';
import Exercise from '../../../types/Exercise';
import {Equipment, Profile} from '../../../types/Shared';
import ListItem from '../../commons/ListItem';
import Text from '../../commons/Text';

const ExerciseList: React.FC<{
  exercises: {[key: string]: Exercise};
  navigation: NativeStackNavigationProp<StackParamList, 'ExerciseList'>;
  route: RouteProp<StackParamList, 'ExerciseList'>;
  workout: Exercise[];
  setWorkoutAction: (workout: Exercise[]) => void;
  loading: boolean;
  profile: Profile;
}> = ({
  exercises,
  route,
  navigation,
  workout,
  setWorkoutAction,
  loading,
  profile,
}) => {
  const {level, goal, equipment, warmUp, coolDown} = route.params;

  const selectExercise = (exercise: Exercise) => {
    if (workout.find(e => e.id === exercise.id)) {
      setWorkoutAction(workout.filter(e => e.id !== exercise.id));
    } else {
      setWorkoutAction([...workout, {...exercise, reps: '15', sets: '3'}]);
    }
  };

  const filtered = useMemo(
    () =>
      Object.values(exercises).filter(exercise => {
        return (
          (exercise.type === goal &&
            (!exercise.equipment ||
              exercise.equipment.every(item => equipment.includes(item)) ||
              ((!exercise.equipment || exercise.equipment.length === 0) &&
                equipment.includes(Equipment.NONE))) &&
            exercise.level === level) ||
          (exercise.warmUp && warmUp.includes(exercise.warmUp)) ||
          (exercise.coolDown && coolDown.includes(exercise.coolDown))
        );
      }),
    [exercises, goal, level, warmUp, coolDown, equipment],
  );
  return (
    <View style={{flex: 1}}>
      {!loading && !filtered.length && (
        <Text style={{textAlign: 'center', margin: 20}}>
          Sorry, no exercises found based on your filter, please try altering
          your settings like adding any equipment you might have
        </Text>
      )}
      <FlatList
        // style={{flex: 1}}
        data={filtered}
        refreshControl={<RefreshControl refreshing={loading} />}
        keyExtractor={(item: Exercise) => item.id || ''}
        renderItem={({item}: {item: Exercise}) => {
          const selected = workout.find(e => e.id === item.id);
          return (
            <>
              <ListItem
                onPress={() => {
                  if (item.premium && !profile.premium) {
                    navigation.navigate('Premium', {});
                  } else {
                    navigation.navigate('CustomizeExercise', {exercise: item});
                  }
                }}
                onLongPress={() => {
                  if (item.premium && !profile.premium) {
                    navigation.navigate('Premium', {});
                  } else {
                    selectExercise(item);
                  }
                }}
                style={{
                  backgroundColor: selected ? colors.appBlue : undefined,
                }}
                title={item.name}
                description={truncate(item.description, 75)}
                accessoryLeft={
                  !item.premium || profile.premium ? (
                    <Image
                      style={{
                        height: 50,
                        width: 75,
                      }}
                      source={
                        item.thumbnail
                          ? {uri: item.thumbnail.src}
                          : require('../../../images/old_man_stretching.jpeg')
                      }
                    />
                  ) : (
                    <View
                      style={{
                        height: 50,
                        width: 75,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon name="lock" size={30} />
                    </View>
                  )
                }
              />
              {item.premium && !profile.premium && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Premium', {})}
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: '#000',
                    opacity: 0.5,
                  }}
                />
              )}
            </>
          );
        }}
      />
    </View>
  );
};

const mapStateToProps = ({exercises, profile}: RootState) => ({
  exercises: exercises.exercises,
  workout: exercises.workout,
  loading: exercises.loading,
  profile: profile.profile,
});

const mapDispatchToProps = {
  setWorkoutAction: setWorkout,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseList);
