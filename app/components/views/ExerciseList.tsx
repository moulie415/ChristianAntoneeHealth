import {Button, List, ListItem, Text} from '@ui-kitten/components';
import React, {
  FunctionComponent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import BottomSheet from 'reanimated-bottom-sheet';
import Picker from '@gregfrench/react-native-wheel-picker';
import {TouchableOpacity, View, ScrollView} from 'react-native';
import Image from 'react-native-fast-image';
import {connect} from 'react-redux';
import colors from '../../constants/colors';
import Exercise from '../../types/Exercise';
import {MyRootState} from '../../types/Shared';
import ExerciseListProps from '../../types/views/ExerciseList';
import {getExercises, setWorkout} from '../../actions/exercises';
import {truncate} from '../../helpers';
import CustomDivider from '../commons/CustomDivider';
import ViewMore from '../commons/ViewMore';

const REPS = [5, 10, 15, 20, 25, 30];
const SETS = [1, 2, 3, 4, 5, 6];

const PickerItem = Picker.Item;

const ExerciseList: FunctionComponent<ExerciseListProps> = ({
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
          reps: Number(reps),
          sets: Number(sets),
        },
      ]);
    }
  };

  const renderContent = () => {
    if (selectedExercise) {
      return (
        <View
          style={{
            padding: 10,
            paddingBottom: 50,
            backgroundColor: colors.appBlack,
          }}>
          <Text category="h5" style={{textAlign: 'center'}}>
            {selectedExercise.name}
          </Text>
          <Image
            style={{
              height: 150,
              width: 200,
              alignSelf: 'center',
              margin: 10,
            }}
            source={require('../../images/old_man_stretching.jpeg')}
          />
          <CustomDivider />
          <ListItem
            title="View similar exercises"
            style={{backgroundColor: colors.appBlack}}
            accessoryLeft={() => <Icon name="sync" color="#fff" />}
          />
          <CustomDivider />
          <ListItem
            onPress={() => {
              selectExercise(selectedExercise);
              bottomSheetRef.current.snapTo(1);
            }}
            title={
              workout.find(e => e.id === selectedExercise.id)
                ? 'Remove exercise'
                : 'Add exercise'
            }
            style={{backgroundColor: colors.appBlack}}
            accessoryLeft={() => (
              <Icon
                name={
                  workout.find(e => e.id === selectedExercise.id)
                    ? 'trash'
                    : 'plus'
                }
                color="#fff"
              />
            )}
          />
          <CustomDivider />
          <ViewMore text={selectedExercise.description} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <View>
              <Text category="s1" style={{textAlign: 'center'}}>
                Repetitions
              </Text>
              <Picker
                style={{width: 150, height: 180}}
                selectedValue={reps}
                lineColor="#fff"
                itemStyle={{color: 'white', fontSize: 26}}
                onValueChange={setReps}>
                {REPS.map(value => (
                  <PickerItem
                    label={value.toString()}
                    value={value}
                    key={value}
                  />
                ))}
              </Picker>
            </View>
            <View>
              <Text category="s1" style={{textAlign: 'center'}}>
                Sets
              </Text>
              <Picker
                style={{width: 150, height: 180}}
                selectedValue={sets}
                lineColor="#fff"
                itemStyle={{color: 'white', fontSize: 26}}
                onValueChange={setSets}>
                {SETS.map(value => (
                  <PickerItem
                    label={value.toString()}
                    value={value}
                    key={value}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      );
    }
    return null;
  };

  const renderHeader = () => {
    return (
      <View style={{backgroundColor: colors.appBlack, alignItems: 'center'}}>
        <Icon color="#ffff" name="minus" size={30} />
      </View>
    );
  };

  const filtered = useMemo(
    () =>
      Object.values(exercises).filter(exercise => {
        return (
          (exercise.area === strengthArea || !exercise.area) &&
          exercise.level === level &&
          goals.includes(exercise.type)
        );
      }),
    [exercises, goals, level, strengthArea],
  );
  return (
    <View style={{backgroundColor: colors.appBlack, flex: 1}}>
      <List
        style={{backgroundColor: colors.appBlack, flex: 1}}
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
                backgroundColor: selected ? colors.appBlue : colors.appBlack,
              }}
              title={item.name}
              description={truncate(item.description, 75)}
              accessoryLeft={() => (
                <Image
                  style={{height: 50, width: 75}}
                  source={require('../../images/old_man_stretching.jpeg')}
                />
              )}
              accessoryRight={() => (
                <TouchableOpacity style={{padding: 10}}>
                  <Icon
                    name="ellipsis-h"
                    color="#fff"
                    size={20}
                    onPress={() => {
                      setSelectedExercise(item);
                      bottomSheetRef.current.snapTo(0);
                    }}
                  />
                </TouchableOpacity>
              )}
            />
          );
        }}
      />

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['70%', 0]}
        borderRadius={10}
        initialSnap={1}
        renderContent={renderContent}
        renderHeader={renderHeader}
      />
    </View>
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
