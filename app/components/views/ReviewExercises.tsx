import {Button, List, ListItem, Text} from '@ui-kitten/components';
import React, {useCallback, useRef, useState} from 'react';
import Image from 'react-native-fast-image';
import {TouchableOpacity, View} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import Picker from '@gregfrench/react-native-wheel-picker';
import colors from '../../constants/colors';
import Exercise from '../../types/Exercise';
import ReviewExercisesProps from '../../types/views/ReviewExercises';
import {truncate} from '../../helpers';
import {Goal, MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import {setWorkout} from '../../actions/exercises';
import CustomDivider from '../commons/CustomDivider';
import Icon from 'react-native-vector-icons/FontAwesome5';
import BottomSheet from 'reanimated-bottom-sheet';
import Snackbar from 'react-native-snackbar';

const REPS = [5, 10, 15, 20, 25, 30];
const SETS = [1, 2, 3, 4, 5, 6];
const RESISTANCE = [...Array(300).keys()];

const PickerItem = Picker.Item;

const ReviewExercises: React.FC<ReviewExercisesProps> = ({
  workout,
  setWorkoutAction,
  navigation,
}) => {
  const bottomSheetRef = useRef<BottomSheet>();
  const [selectedExercise, setSelectedExercise] = useState<Exercise>();
  const [reps, setReps] = useState(15);
  const [sets, setSets] = useState(3);
  const [resistance, setResistance] = useState(0);
  const removeExercise = (exercise: Exercise) => {
    setWorkoutAction(workout.filter(e => e.id !== exercise.id));
    Snackbar.show({text: 'Exercise removed'});
  };
  const renderItem = useCallback(
    ({item, index, drag, isActive}: RenderItemParams<Exercise>) => {
      return (
        <ListItem
          style={{backgroundColor: isActive ? colors.appBlue : colors.appBlack}}
          onLongPress={drag}
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
                  bottomSheetRef.current?.snapTo(0);
                }}
              />
            </TouchableOpacity>
          )}
        />
      );
    },
    [],
  );

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
                  itemStyle={{color: 'white', fontSize: 26}}
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
          <Button
            style={{margin: 10, marginTop: 30}}
            onPress={() => {
              removeExercise(selectedExercise);
              bottomSheetRef.current?.snapTo(1);
            }}>
            Remove exercise
          </Button>
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
    <View style={{backgroundColor: colors.appBlack, flex: 1}}>
      <Text style={{margin: 10, marginBottom: 0}} category="h5">
        Review exercises
      </Text>
      <Text style={{marginHorizontal: 10}} appearance="hint">
        (Hold and drag to reorder)
      </Text>
      <DraggableFlatList
        data={workout}
        style={{backgroundColor: colors.appBlack, flex: 1}}
        ItemSeparatorComponent={() => <CustomDivider />}
        renderItem={renderItem}
        ListFooterComponent={() => (
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={navigation.goBack}>
            <View
              style={{
                height: 50,
                width: 75,
                backgroundColor: colors.appBlue,
                marginLeft: 7,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name="plus" size={25} />
            </View>
            <Text
              category="s1"
              style={{
                alignSelf: 'center',
                marginLeft: 10,
                color: colors.appBlue,
              }}>
              Add exercise
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        onDragEnd={({data}) => setWorkoutAction(data)}
      />
      <Button
        onPress={() => navigation.navigate('StartWorkout')}
        style={{position: 'absolute', bottom: 30, left: 10, right: 10}}>
        Start workout
      </Button>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['65%', 0]}
        borderRadius={10}
        initialSnap={1}
        renderContent={renderContent}
        renderHeader={renderHeader}
      />
    </View>
  );
};

const mapStateToProps = ({exercises}: MyRootState) => ({
  workout: exercises.workout,
});

const mapDispatchToProps = {
  setWorkoutAction: setWorkout,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewExercises);
