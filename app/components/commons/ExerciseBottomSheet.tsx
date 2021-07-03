import React, {MutableRefObject} from 'react';
import {View, Image} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import BottomSheet from 'reanimated-bottom-sheet';
import Exercise from '../../types/Exercise';
import colors from '../../constants/colors';
import {Text, Button} from '@ui-kitten/components';
import {Goal, MyRootState} from '../../types/Shared';
import Snackbar from 'react-native-snackbar';
import {connect} from 'react-redux';
import {setWorkout} from '../../actions/exercises';

const REPS = [5, 10, 15, 20, 25, 30];
const SETS = [1, 2, 3, 4, 5, 6];
const RESISTANCE = [...Array(301).keys()];

const PickerItem = Picker.Item;

const ExerciseBottomSheet: React.FC<{
  bottomSheetRef: MutableRefObject<BottomSheet>;
  selectedExercise?: Exercise;
  workout: Exercise[];
  sets: number;
  reps: number;
  resistance: number;
  setSets: (sets: number) => void;
  setReps: (reps: number) => void;
  setResistance: (resistance: number) => void;
  setWorkoutAction: (workout: Exercise[]) => void;
  setOpen: (open: boolean) => void;
  open: boolean;
}> = ({
  bottomSheetRef,
  selectedExercise,
  setWorkoutAction,
  workout,
  sets,
  reps,
  resistance,
  setSets,
  setReps,
  setResistance,
  setOpen,
  open,
}) => {
  const selected = workout.find(e => e.id === selectedExercise?.id);
  const selectExercise = () => {
    if (selected) {
      setWorkoutAction(workout.filter(e => e.id !== selectedExercise.id));
      setTimeout(() => {
        Snackbar.show({text: 'Exercise removed'});
      }, 500);
    } else {
      setWorkoutAction([
        ...workout,
        {
          ...selectedExercise,
          reps,
          sets,
          resistance,
        },
      ]);
      setTimeout(() => {
        Snackbar.show({text: 'Exercise added'});
      }, 500);
    }
  };

  const saveExercise = () => {
    setWorkout([
      ...workout.filter(e => e.id !== selectedExercise.id),
      {
        ...selectedExercise,
        reps,
        sets,
        resistance,
      },
    ]);
    setTimeout(() => {
      Snackbar.show({text: 'Exercise saved'});
    }, 500);
  };

  const renderContent = () => {
    if (selectedExercise) {
      return (
        <View
          style={{
            paddingBottom: 50,
            backgroundColor: colors.appBlack,
          }}>
          <Text category="h5" style={{textAlign: 'center'}}>
            {selectedExercise.name}
          </Text>
          <Image
            style={{
              height: 150,
              width: '100%',
              alignSelf: 'center',
              margin: 10,
            }}
            source={require('../../images/old_man_stretching.jpeg')}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <View>
              <Text category="s1" style={{textAlign: 'center'}}>
                Repetitions
              </Text>
              <Picker
                style={{width: 120, height: 180}}
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
                style={{width: 120, height: 180}}
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
            {(selectedExercise.type === Goal.BALANCE ||
              selectedExercise.type === Goal.STRENGTH) && (
              <View>
                <Text category="s1" style={{textAlign: 'center'}}>
                  Resistance
                </Text>
                <Picker
                  style={{width: 120, height: 180}}
                  selectedValue={resistance}
                  lineColor="#fff"
                  itemStyle={{color: 'white', fontSize: 15}}
                  onValueChange={setResistance}>
                  {RESISTANCE.map(value => (
                    <PickerItem
                      label={
                        value === 0 ? 'Bodyweight' : `${value.toString()} kg`
                      }
                      value={value}
                      key={value}
                    />
                  ))}
                </Picker>
              </View>
            )}
          </View>
          <View style={{marginTop: 30}}>
            {selected && (
              <Button
                onPress={() => {
                  saveExercise();
                  bottomSheetRef.current.snapTo(1);
                  setOpen(false);
                }}
                style={{margin: 10}}>
                Save exercise
              </Button>
            )}
            <Button
              style={{margin: 10}}
              onPress={() => {
                selectExercise();
                bottomSheetRef.current.snapTo(1);
                setOpen(false);
              }}>
              {workout.find(e => e.id === selectedExercise.id)
                ? 'Remove exercise'
                : 'Add exercise'}
            </Button>
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
  return (
    <>
      {open && (
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        />
      )}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={[selected ? '70%' : '65%', 0]}
        borderRadius={10}
        initialSnap={1}
        onCloseStart={() => setOpen(false)}
        renderContent={renderContent}
        renderHeader={renderHeader}
      />
    </>
  );
};

const mapStateToProps = ({exercises}: MyRootState) => ({
  workout: exercises.workout,
});

const mapDispatchToProps = {
  setWorkoutAction: setWorkout,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExerciseBottomSheet);
