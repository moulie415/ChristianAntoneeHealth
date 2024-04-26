import React, {RefObject} from 'react';
import {View} from 'react-native';
import PagerView from 'react-native-pager-view';
import Exercise from '../../types/Exercise';
import {Profile} from '../../types/Shared';
import ExerciseTimer from './ExerciseTimer';
import MusclesDiagram from './MusclesDiagram';
import MyTabs from './MyTabs';

const WorkoutTabs: React.FC<{
  tabIndex: number;
  setTabIndex: (index: number) => void;
  exercise: Exercise;
  i: number;
  index: number;
  workout: Exercise[];
  pagerRef: RefObject<PagerView>;
  timerPaused: boolean;
  onTimerPaused: (paused: boolean) => void;
  profile: Profile;
}> = ({
  tabIndex,
  setTabIndex,
  exercise,
  i,
  index,
  workout,
  pagerRef,
  timerPaused,
  onTimerPaused,
  profile,
}) => {
  const tabs = ['Timer', 'Muscles'];

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
            timerPaused={timerPaused}
            onTimerPaused={onTimerPaused}
          />
        )}
        {i !== index && tabIndex === 0 && <View style={{height: 200}} />}

        {tabIndex === 1 && i === index && (
          <MusclesDiagram
            primary={exercise.muscles}
            secondary={exercise.musclesSecondary}
            gender={profile.gender}
          />
        )}
      </View>
    </>
  );
};

export default WorkoutTabs;
