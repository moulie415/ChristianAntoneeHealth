import React, {MutableRefObject} from 'react';
import {Platform} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import BottomSheet from '@gorhom/bottom-sheet';
import Exercise from '../../types/Exercise';
import colors from '../../constants/colors';
import {Text, Button, Layout} from '@ui-kitten/components';
import {Goal, MyRootState} from '../../types/Shared';
import Snackbar from 'react-native-snackbar';
import {connect} from 'react-redux';
import {setWorkout} from '../../actions/exercises';
import Image from 'react-native-fast-image';
import DevicePixels from '../../helpers/DevicePixels';
import {ScrollView} from 'react-native-gesture-handler';

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
        snapPoints={['80%']}
        index={-1}
        onClose={() => setOpen(false)}
        enablePanDownToClose>
        <ScrollView>
          {selectedExercise ? (
            <Layout
              style={{
                paddingBottom: DevicePixels[50],
              }}>
              <Text
                category="h5"
                style={{
                  textAlign: 'center',
                  marginHorizontal: DevicePixels[10],
                }}>
                {selectedExercise.name}
              </Text>
              <Image
                style={{
                  height: DevicePixels[150],
                  width: '100%',
                  alignSelf: 'center',
                  margin: DevicePixels[10],
                }}
                source={
                  selectedExercise.thumbnail
                    ? {uri: selectedExercise.thumbnail.src}
                    : require('../../images/old_man_stretching.jpeg')
                }
              />
              <Layout
                style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <Layout>
                  <Picker
                    style={{
                      width: DevicePixels[120],
                      height: DevicePixels[180],
                    }}
                    selectedValue={reps}
                    lineColor="#999999"
                    itemStyle={{
                      fontSize: DevicePixels[15],
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
                    style={{
                      width: DevicePixels[120],
                      height: DevicePixels[180],
                    }}
                    selectedValue={sets}
                    lineColor="#999999"
                    itemStyle={{
                      fontSize: DevicePixels[15],
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
                {selectedExercise.type === Goal.STRENGTH && (
                  <Layout>
                    <Picker
                      style={{
                        width: DevicePixels[120],
                        height: DevicePixels[180],
                      }}
                      selectedValue={resistance}
                      lineColor="#999999"
                      itemStyle={{
                        fontSize: DevicePixels[15],
                        color: Platform.OS === 'android' ? '#000' : undefined,
                      }}
                      onValueChange={setResistance}>
                      {RESISTANCE.map(value => (
                        <PickerItem
                          label={
                            value === 0
                              ? 'Bodyweight'
                              : `${value.toString()} kg`
                          }
                          value={value}
                          key={value}
                        />
                      ))}
                    </Picker>
                  </Layout>
                )}
              </Layout>
              <Layout style={{marginTop: DevicePixels[30]}}>
                {selected && (
                  <Button
                    onPress={() => {
                      saveExercise();
                      bottomSheetRef.current.close();
                      setOpen(false);
                    }}
                    style={{margin: DevicePixels[10]}}>
                    Save exercise
                  </Button>
                )}
                <Button
                  style={{margin: DevicePixels[10]}}
                  onPress={() => {
                    selectExercise();
                    bottomSheetRef.current.close();
                    setOpen(false);
                  }}>
                  {workout.find(e => e.id === selectedExercise.id)
                    ? 'Remove exercise'
                    : 'Add exercise'}
                </Button>
              </Layout>
            </Layout>
          ) : null}
        </ScrollView>
      </BottomSheet>
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
