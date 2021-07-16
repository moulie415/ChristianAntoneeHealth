import React, {MutableRefObject} from 'react';
import {View, Image, Platform} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import BottomSheet from 'reanimated-bottom-sheet';
import Exercise from '../../types/Exercise';
import colors from '../../constants/colors';
import {Text, Button, Layout} from '@ui-kitten/components';
import {Goal, MyRootState} from '../../types/Shared';
import Snackbar from 'react-native-snackbar';
import {connect} from 'react-redux';
import {setWorkout} from '../../actions/exercises';

const REPS = [...Array(101).keys()];
REPS.shift();
const SETS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
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
        <Layout
          style={{
            paddingBottom: 50,
          }}>
          <Layout style={{alignItems: 'center'}}>
            <Icon color="#000" name="minus" size={30} />
          </Layout>
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
          <Layout
            style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <Layout>
              <Picker
                style={{width: 120, height: 180}}
                selectedValue={reps}
                lineColor="#fff"
                itemStyle={{
                  fontSize: 15,
                  color: Platform.OS === 'android' ? '#000' : undefined,
                }}
                onValueChange={setReps}>
                {REPS.map(value => {
                  return (
                    <PickerItem
                      label={`${value.toString()} ${
                        value === 1 ? 'rep' : 'reps'
                      }`}
                      value={value}
                      key={value}
                    />
                  );
                })}
              </Picker>
            </Layout>
            <Layout>
              <Picker
                style={{width: 120, height: 180}}
                selectedValue={sets}
                lineColor="#fff"
                itemStyle={{
                  fontSize: 15,
                  color: Platform.OS === 'android' ? '#000' : undefined,
                }}
                onValueChange={setSets}>
                {SETS.map(value => (
                  <PickerItem
                    label={`${value.toString()} ${
                      value === 1 ? 'set' : 'sets'
                    }`}
                    value={value}
                    key={value}
                  />
                ))}
              </Picker>
            </Layout>
            {(selectedExercise.type === Goal.BALANCE ||
              selectedExercise.type === Goal.STRENGTH) && (
              <Layout>
                <Picker
                  style={{width: 120, height: 180}}
                  selectedValue={resistance}
                  lineColor="#fff"
                  itemStyle={{
                    fontSize: 15,
                    color: Platform.OS === 'android' ? '#000' : undefined,
                  }}
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
              </Layout>
            )}
          </Layout>
          <Layout style={{marginTop: 30}}>
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
          </Layout>
        </Layout>
      );
    }
    return null;
  };

  const renderHeader = () => {
    return (
      <Layout style={{alignItems: 'center'}}>
        <Icon color="#ffff" name="minus" size={30} />
      </Layout>
    );
  };
  return (
    <>
      {open && (
        <Layout
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
        // renderHeader={renderHeader}
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
