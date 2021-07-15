import {Button, Layout, ListItem, Text} from '@ui-kitten/components';
import React, {useCallback, useRef, useState} from 'react';
import Image from 'react-native-fast-image';
import {TouchableOpacity, View} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
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
import ExerciseBottomSheet from '../commons/ExerciseBottomSheet';

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
  const [modalOpen, setModalOpen] = useState(false);

  const renderItem = useCallback(
    ({item, index, drag, isActive}: RenderItemParams<Exercise>) => {
      return (
        <ListItem
          style={{backgroundColor: isActive ? colors.appBlue : undefined}}
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
                  setModalOpen(true);
                }}
              />
            </TouchableOpacity>
          )}
        />
      );
    },
    [],
  );

  return (
    <Layout style={{flex: 1}}>
      <Text style={{margin: 10, marginBottom: 0}} category="h5">
        Review exercises
      </Text>
      <Text style={{marginHorizontal: 10}} appearance="hint">
        (Hold and drag to reorder)
      </Text>
      <DraggableFlatList
        data={workout}
        style={{flex: 1}}
        ItemSeparatorComponent={() => <CustomDivider />}
        renderItem={renderItem}
        ListFooterComponent={() => (
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={navigation.goBack}>
            <Layout
              style={{
                height: 50,
                width: 75,
                backgroundColor: colors.appBlue,
                marginLeft: 7,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name="plus" size={25} />
            </Layout>
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
      <ExerciseBottomSheet
        selectedExercise={selectedExercise}
        bottomSheetRef={bottomSheetRef}
        reps={reps}
        sets={sets}
        resistance={resistance}
        setSets={setSets}
        setReps={setReps}
        setResistance={setResistance}
        open={modalOpen}
        setOpen={setModalOpen}
      />
    </Layout>
  );
};

const mapStateToProps = ({exercises}: MyRootState) => ({
  workout: exercises.workout,
});

const mapDispatchToProps = {
  setWorkoutAction: setWorkout,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewExercises);
