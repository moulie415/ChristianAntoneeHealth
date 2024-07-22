import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {RootState, StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import {SettingsState} from '../../../reducers/settings';
import Exercise from '../../../types/Exercise';
import QuickRoutine from '../../../types/QuickRoutines';
import {Profile} from '../../../types/Shared';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import Header from '../../commons/Header';
import WorkoutCard from '../../commons/WorkoutCard';

const {height} = Dimensions.get('screen');

const WorkoutList: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'WorkoutList'>;
  route: RouteProp<StackParamList, 'WorkoutList'>;
  quickRoutines: {[key: string]: QuickRoutine};
  profile: Profile;
  settings: SettingsState;
  exercises: {[key: string]: Exercise};
  loading: boolean;
}> = ({
  navigation,
  route,
  quickRoutines,
  profile,
  settings,
  exercises,
  loading,
}) => {
  const {area, equipment} = route.params;

  const [selectedItem, setSelectedItem] = useState<QuickRoutine>();

  useEffect(() => {
    if (selectedItem) {
      navigation.navigate('PreQuickRoutine', {routine: selectedItem});
    }
  }, [navigation, selectedItem]);

  const filtered = Object.values(quickRoutines)
    .filter(routine => {
      return (
        routine.area === area &&
        (routine.equipment === equipment || equipment === 'full')
      );
    })
    .sort((a, b) => {
      if (profile.premium) {
        return 0;
      }

      if (a.premium && !b.premium) {
        return 1;
      }
      if (b.premium && !a.premium) {
        return -1;
      }
      return 0;
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
                    navigation.navigate('PreQuickRoutine', {routine: item});
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
}: RootState) => ({
  quickRoutines: quickRoutines.quickRoutines,
  profile: profile.profile,
  settings,
  exercises: exercises.exercises,
  loading: exercises.loading,
});


export default connect(mapStateToProps)(WorkoutList);
