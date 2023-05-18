import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import Exercise from '../../types/Exercise';
import MusclesDiagram from './MusclesDiagram';
import ViewMore from './ViewMore';
import globalStyles from '../../styles/globalStyles';

const WorkoutTabs: React.FC<{
  tabIndex: number;
  setTabIndex: (index: number) => void;
  exercise: Exercise;
  i: number;
  index: number;
  setShowResistanceModal: (show: boolean) => void;
}> = ({tabIndex, setTabIndex, exercise, setShowResistanceModal, i, index}) => {
  const hasSetsRepsTab =
    !!exercise.reps || !!exercise.reps || !!exercise.resistanceScale;
  const tabs = ['Description', 'Diagram'];
  if (hasSetsRepsTab) {
    tabs.unshift('Reps/Sets');
  }
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          marginVertical: 10,
        }}>
        {tabs.map((tab, index) => {
          return (
            <TouchableOpacity
              key={tab}
              style={{}}
              onPress={() => setTabIndex(index)}>
              <LinearGradient
                colors={
                  tabIndex === index
                    ? [colors.appBlueLight, colors.appBlueDark]
                    : ['transparent', 'transparent']
                }
                style={{
                  height: 40,
                  width: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 25,
                  backgroundColor:
                    tabIndex === index ? colors.textGrey : colors.appGrey,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: colors.appWhite,
                    textAlign: 'center',
                  }}>
                  {tab}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>
      <View>
        {tabIndex === 0 && hasSetsRepsTab && (
          <>
            <View
              style={{
                alignItems: 'flex-start',
                justifyContent: 'space-evenly',
                margin: 10,
                marginVertical: 0,
              }}>
              {!!exercise.reps && (
                <View
                  style={{
                    //      backgroundColor: colors.appBlue,
                    padding: 2,
                    paddingHorizontal: 5,
                    borderRadius: 10,
                    marginVertical: 5,
                    marginRight: 5,
                  }}>
                  <Text
                    style={{
                      color: colors.appWhite,
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}>{`Reps: ${exercise.reps}`}</Text>
                </View>
              )}
              {!!exercise.sets && (
                <View
                  style={{
                    //    backgroundColor: colors.appBlue,
                    padding: 2,
                    paddingHorizontal: 5,
                    borderRadius: 10,
                    marginVertical: 5,
                    marginRight: 5,
                  }}>
                  <Text
                    style={{
                      color: colors.appWhite,
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                      fontSize: 20,
                    }}>{`Sets: ${exercise.sets}`}</Text>
                </View>
              )}
              {!!exercise.resistanceScale && (
                <TouchableOpacity
                  onPress={() => setShowResistanceModal(true)}
                  style={{
                    backgroundColor: colors.appBlue,
                    padding: 2,
                    paddingHorizontal: 5,
                    borderRadius: 10,
                    marginVertical: 5,
                    marginRight: 5,
                  }}>
                  <Text
                    style={{
                      color: colors.appWhite,
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                      fontSize: 20,
                    }}>{`resistance scale: ${exercise.resistanceScale}`}</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}

        {((tabIndex === 1 && hasSetsRepsTab) ||
          (tabIndex === 0 && !hasSetsRepsTab)) && (
          <ViewMore text={exercise.description} lines={5} />
        )}

        {((tabIndex === 2 && hasSetsRepsTab) ||
          (tabIndex === 1 && !hasSetsRepsTab)) &&
          i === index && (
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
