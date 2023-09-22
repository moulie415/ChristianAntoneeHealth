import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState, RefObject} from 'react';
import Exercise from '../../types/Exercise';
import MusclesDiagram from './MusclesDiagram';
import ExerciseTimer from './ExerciseTimer';
import PagerView from 'react-native-pager-view';
import MyTabs from './MyTabs';

const WorkoutTabs: React.FC<{
  tabIndex: number;
  setTabIndex: (index: number) => void;
  exercise: Exercise;
  i: number;
  index: number;
  setShowResistanceModal: (show: boolean) => void;
  workout: Exercise[];
  pagerRef: RefObject<PagerView>;
}> = ({
  tabIndex,
  setTabIndex,
  exercise,
  setShowResistanceModal,
  i,
  index,
  workout,
  pagerRef,
}) => {
  const tabs = ['Directions', 'Muscles'];

  return (
    <>
      <MyTabs tabs={tabs} setTabIndex={setTabIndex} tabIndex={tabIndex} />
      <View
        style={{marginHorizontal: 20, marginVertical: 15, marginBottom: 20}}>
        {i === index && (
          <ExerciseTimer
            index={index}
            tabIndex={tabIndex}
            exercise={exercise}
            workout={workout}
            pagerRef={pagerRef}
          />
        )}

        {tabIndex === 1 && i === index && (
          <MusclesDiagram
            primary={exercise.muscles}
            secondary={exercise.musclesSecondary}
          />
        )}
      </View>
    </>
  );
};

export default WorkoutTabs;
