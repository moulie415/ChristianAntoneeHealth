import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
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
    !!exercise.reps ||
    !!exercise.reps ||
    !!exercise.resistanceScale ||
    !!exercise.weight;
  const tabs = ['Description', 'Diagram'];
  if (hasSetsRepsTab) {
    tabs.unshift('Reps/Sets');
  }
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
      <View style={{marginHorizontal: 20, marginTop: 15}}>
        {tabIndex === 0 && hasSetsRepsTab && (
          <View
            style={{
              alignItems: 'flex-start',
              justifyContent: 'space-evenly',
              marginHorizontal: 20,
              height: 200,
            }}>
            {!!exercise.reps && (
              <Text
                style={{
                  color: colors.appWhite,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>{`Reps: ${exercise.reps}`}</Text>
            )}
            {!!exercise.sets && (
              <Text
                style={{
                  color: colors.appWhite,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  fontSize: 20,
                }}>{`Sets: ${exercise.sets}`}</Text>
            )}
            {!!exercise.resistanceScale && (
              <TouchableOpacity
                onPress={() => setShowResistanceModal(true)}
                style={{}}>
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
            {!!exercise.weight && (
              <Text
                style={{
                  color: colors.appWhite,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  fontSize: 20,
                }}>{`Weight: ${exercise.weight}`}</Text>
            )}
          </View>
        )}

        {((tabIndex === 1 && hasSetsRepsTab) ||
          (tabIndex === 0 && !hasSetsRepsTab)) && (
          <ViewMore textAlign="justify" text={exercise.description} lines={5} />
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
