import {Layout, List, ListItem} from '@ui-kitten/components';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import BottomSheet from 'reanimated-bottom-sheet';
import {TouchableOpacity} from 'react-native';
import Image from 'react-native-fast-image';
import {connect} from 'react-redux';
import colors from '../../constants/colors';
import Exercise from '../../types/Exercise';
import {Goal, MyRootState} from '../../types/Shared';
import ExerciseListProps from '../../types/views/ExerciseList';
import {getExercises, setWorkout} from '../../actions/exercises';
import {truncate} from '../../helpers';
import ExerciseBottomSheet from '../commons/ExerciseBottomSheet';
import globalStyles from '../../styles/globalStyles';
import AbsoluteSpinner from '../commons/AbsoluteSpinner';
import DevicePixels from '../../helpers/DevicePixels';

const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  route,
  navigation,
  getExercisesAction,
  workout,
  setWorkoutAction,
}) => {
  const {strengthArea, level, goals} = route.params;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise>();
  const [reps, setReps] = useState(15);
  const [sets, setSets] = useState(3);
  const [resistance, setResistance] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getExercisesAction(level, goals, strengthArea);
  }, [getExercisesAction, level, goals, strengthArea]);

  const selectExercise = (exercise: Exercise) => {
    if (workout.find(e => e.id === exercise.id)) {
      setWorkoutAction(workout.filter(e => e.id !== exercise.id));
    } else {
      setWorkoutAction([
        ...workout,
        {
          ...exercise,
          reps,
          sets,
          resistance,
        },
      ]);
    }
  };

  const filtered = useMemo(
    () =>
      Object.values(exercises).filter(exercise => {
        return (
          (exercise.area === strengthArea ||
            (goals.includes(Goal.FLEXIBILITY) &&
              exercise.type === Goal.FLEXIBILITY) ||
            (goals.includes(Goal.CARDIO) && exercise.type === Goal.CARDIO) ||
            (goals.includes(Goal.BALANCE) && exercise.type === Goal.BALANCE)) &&
          (exercise.level === level ||
            (goals.includes(Goal.FLEXIBILITY) &&
              exercise.type === Goal.FLEXIBILITY)) &&
          goals.includes(exercise.type)
        );
      }),
    [exercises, goals, level, strengthArea],
  );
  return (
    <Layout style={{flex: 1}}>
      <List
        style={{flex: 1}}
        data={filtered}
        keyExtractor={(item: Exercise) => item.id}
        renderItem={({item}: {item: Exercise}) => {
          const selected = workout.find(e => e.id === item.id);
          return (
            <ListItem
              onPress={() =>
                navigation.navigate('CustomizeExercise', {exercise: item})
              }
              onLongPress={() => selectExercise(item)}
              style={{
                backgroundColor: selected ? colors.appBlue : undefined,
              }}
              title={item.name}
              description={truncate(item.description, 75)}
              accessoryLeft={() => (
                <Image
                  style={{height: DevicePixels[50], width: DevicePixels[75]}}
                  source={
                    item.thumbnail
                      ? {uri: item.thumbnail.src}
                      : require('../../images/old_man_stretching.jpeg')
                  }
                />
              )}
              accessoryRight={() => (
                <TouchableOpacity style={{padding: DevicePixels[10]}}>
                  <Icon
                    name="ellipsis-h"
                    color={selected ? '#fff' : colors.appBlue}
                    size={DevicePixels[20]}
                    onPress={() => {
                      setSelectedExercise(item);
                      bottomSheetRef.current.snapTo(0);
                      setModalOpen(true);
                    }}
                  />
                </TouchableOpacity>
              )}
            />
          );
        }}
      />
      <AbsoluteSpinner loading={!(filtered && filtered.length > 0)} />
      <ExerciseBottomSheet
        selectedExercise={selectedExercise}
        bottomSheetRef={bottomSheetRef}
        reps={reps}
        sets={sets}
        resistance={resistance}
        setSets={setSets}
        setReps={setReps}
        setResistance={setResistance}
        setOpen={setModalOpen}
        open={modalOpen}
      />
    </Layout>
  );
};

const mapStateToProps = ({exercises}: MyRootState) => ({
  exercises: exercises.exercises,
  workout: exercises.workout,
});

const mapDispatchToProps = {
  getExercisesAction: getExercises,
  setWorkoutAction: setWorkout,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseList);
