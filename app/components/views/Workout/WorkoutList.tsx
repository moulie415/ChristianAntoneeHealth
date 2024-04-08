import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import {getExercisesById} from '../../../reducers/exercises';
import {
  getQuickRoutines,
  startQuickRoutine,
} from '../../../reducers/quickRoutines';
import {SettingsState} from '../../../reducers/settings';
import Exercise from '../../../types/Exercise';
import {Profile} from '../../../types/Shared';
import QuickRoutine from '../../../types/QuickRoutines';
import {MyRootState} from '../../../types/Shared';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import Header from '../../commons/Header';
import WorkoutCard from '../../commons/WorkoutCard';

const {height} = Dimensions.get('screen');

const WorkoutList: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'WorkoutList'>;
  route: RouteProp<StackParamList, 'WorkoutList'>;
  quickRoutines: {[key: string]: QuickRoutine};
  getQuickRoutines: () => void;
  getExercisesById: (ids: string[]) => void;
  profile: Profile;
  settings: SettingsState;
  exercises: {[key: string]: Exercise};
  loading: boolean;
  startQuickRoutine: (routine: QuickRoutine) => void;
}> = ({
  navigation,
  route,
  getQuickRoutines: getQuickRoutinesAction,
  quickRoutines,
  getExercisesById: getExercisesByIdAction,
  profile,
  settings,
  exercises,
  loading,
  startQuickRoutine: startQuickRoutineAction,
}) => {
  const {area, equipment} = route.params;

  const [selectedItem, setSelectedItem] = useState<QuickRoutine>();

  useEffect(() => {
    getQuickRoutinesAction();
  }, [getQuickRoutinesAction]);
  useEffect(() => {
    if (quickRoutines) {
      const ids: string[] = Object.values(quickRoutines).reduce(
        (acc: string[], cur) => {
          const missing = cur.exerciseIds.filter(e => !exercises[e]);
          return [...acc, ...missing];
        },
        [],
      );
      if (ids && ids.length) {
        getExercisesByIdAction(ids);
      }
    }
  }, [exercises, quickRoutines, getExercisesByIdAction]);

  useEffect(() => {
    if (selectedItem) {
      getExercisesByIdAction(selectedItem.exerciseIds);
      navigation.navigate('PreQuickRoutine', {routine: selectedItem});
      startQuickRoutineAction(selectedItem);
    }
  }, [
    navigation,
    selectedItem,
    getExercisesByIdAction,
    startQuickRoutineAction,
  ]);

  const filtered = Object.values(quickRoutines).filter(routine => {
    return (
      routine.area === area &&
      (routine.equipment === equipment || equipment === 'full')
    );
  });

  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView style={{flex: 1}}>
        <Header hasBack />
        <FlatList
          ListEmptyComponent={() => (
            <SafeAreaView style={{height: height / 2}}>
              <AbsoluteSpinner
                loading
                style={{backgroundColor: colors.appGrey}}
              />
            </SafeAreaView>
          )}
          data={filtered}
          renderItem={({item}) => {
            return (
              <WorkoutCard
                key={item.id}
                item={item}
                onPress={() => {
                  if (item.premium && !profile.premium) {
                    navigation.navigate('Premium', {});
                  } else {
                    getExercisesByIdAction(item.exerciseIds);
                    navigation.navigate('PreQuickRoutine', {routine: item});
                    startQuickRoutineAction(item);
                  }
                }}
              />
            );
          }}
        />
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = ({
  quickRoutines,
  profile,
  settings,
  exercises,
}: MyRootState) => ({
  quickRoutines: quickRoutines.quickRoutines,
  profile: profile.profile,
  settings,
  exercises: exercises.exercises,
  loading: exercises.loading,
});

const mapDispatchToProps = {
  getQuickRoutines,
  getExercisesById,
  startQuickRoutine,
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutList);
