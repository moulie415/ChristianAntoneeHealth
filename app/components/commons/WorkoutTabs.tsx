import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState, RefObject} from 'react';
import colors from '../../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import Exercise from '../../types/Exercise';
import MusclesDiagram from './MusclesDiagram';
import ViewMore from './ViewMore';
import globalStyles from '../../styles/globalStyles';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import useInterval from '../../hooks/UseInterval';
import moment from 'moment';
import ExerciseTimer from './ExerciseTimer';
import PagerView from 'react-native-pager-view';
import { PlanWorkout } from '../../types/Shared';

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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 10,
          marginTop: 20,
        }}>
        {tabs.map((tab, index) => {
          return (
            <TouchableOpacity
              key={tab}
              style={{}}
              onPress={() => setTabIndex(index)}>
              <View
                style={{
                  height: 40,
                  width: 110,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor:
                    tabIndex === index ? colors.borderColor : 'transparent',
                  borderRadius: 12,
                  borderTopRightRadius: index === 0 ? 0 : 12,
                  borderBottomRightRadius: index === 0 ? 0 : 12,
                  borderTopLeftRadius: index === tabs.length - 1 ? 0 : 12,
                  borderBottomLeftRadius: index === tabs.length - 1 ? 0 : 12,
                  borderWidth: 2,
                  borderColor:
                    tabIndex === index
                      ? colors.borderColor
                      : colors.borderColor,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: tabIndex === index ? colors.appWhite : colors.button,
                    textAlign: 'center',
                  }}>
                  {tab}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
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
