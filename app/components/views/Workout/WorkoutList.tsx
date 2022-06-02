import {Dimensions, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import {RouteProp} from '@react-navigation/native';
import {List} from '@ui-kitten/components';
import {connect} from 'react-redux';
import {Goal, Level, MyRootState} from '../../../types/Shared';
import QuickRoutine, {Equipment} from '../../../types/QuickRoutines';
import {getQuickRoutines} from '../../../actions/quickRoutines';
import Text from '../../commons/Text';
import {useInterstitialAd} from '@react-native-admob/admob';
import {UNIT_ID_INTERSTITIAL} from '../../../constants';
import {getExercisesById} from '../../../actions/exercises';
import DevicePixels from '../../../helpers/DevicePixels';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Profile from '../../../types/Profile';
import {SettingsState} from '../../../reducers/settings';
import colors from '../../../constants/colors';
import ImageLoader from '../../commons/ImageLoader';
import globalStyles from '../../../styles/globalStyles';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import {SafeAreaView} from 'react-native-safe-area-context';
import Exercise from '../../../types/Exercise';

const {height} = Dimensions.get('screen');

const getEquipmentString = (equipment: Equipment) => {
  if (equipment === 'full') {
    return 'Full Equipment';
  }
  if (equipment === 'minimal') {
    return 'Minimal Equipment';
  }
  return 'No Equipment';
};

const getFocusString = (focus: Goal) => {
  if (focus === Goal.FITNESS) {
    return 'Fitness';
  }
  return 'Strength';
};

const getLevelString = (level: Level) => {
  if (level === 'beginner') {
    return 'Beginner';
  }
  if (level === 'intermediate') {
    return 'Intermediate';
  }
  return 'Advanced';
};

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
}) => {
  const {area, equipment} = route.params;
  const {adLoaded, adDismissed, show} = useInterstitialAd(UNIT_ID_INTERSTITIAL);
  const [selectedItem, setSelectedItem] = useState<QuickRoutine>();

  useEffect(() => {
    getQuickRoutinesAction();
  }, [getQuickRoutinesAction]);
  useEffect(() => {
    if (quickRoutines) {
      const ids = Object.values(quickRoutines).reduce((acc, cur) => {
        const missing = cur.exerciseIds.filter(e => !exercises[e]);
        return [...acc, ...missing];
      }, []);
      if (ids && ids.length) {
        getExercisesByIdAction(ids);
      }
    }
  }, [exercises, quickRoutines, getExercisesByIdAction]);

  useEffect(() => {
    if (adDismissed && selectedItem) {
      getExercisesByIdAction(selectedItem.exerciseIds);
      navigation.navigate('QuickRoutine', {routine: selectedItem});
    }
  }, [adDismissed, navigation, selectedItem, getExercisesByIdAction]);

  const filtered = Object.values(quickRoutines).filter(routine => {
    return (
      routine.area === area &&
      (routine.equipment === equipment || equipment === 'full')
    );
  });

  return (
    <View>
      <List
        ListEmptyComponent={() => (
          <SafeAreaView style={{height: height - DevicePixels[50]}}>
            <AbsoluteSpinner loading />
          </SafeAreaView>
        )}
        data={filtered}
        renderItem={({item, index}) => {
          const locked = item.premium && !profile.premium;
          return (
            <TouchableOpacity
              onPress={() => {
                if (item.premium && !profile.premium) {
                  navigation.navigate('Premium');
                } else if (adLoaded && !profile.premium && settings.ads) {
                  setSelectedItem(item);
                  show();
                } else {
                  getExercisesByIdAction(item.exerciseIds);
                  navigation.navigate('QuickRoutine', {routine: item});
                }
              }}
              key={item.id}
              style={{
                height: DevicePixels[100],
                marginBottom: DevicePixels[1],
              }}>
              <ImageLoader
                style={{width: '100%', flex: 1}}
                delay={index * 200}
                resizeMode="cover"
                source={
                  item.thumbnail
                    ? {uri: item.thumbnail.src}
                    : require('../../../images/Homepage_quick_routine.jpeg')
                }
                overlay
              />
              {locked ? (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: DevicePixels[10],
                    right: 0,
                    bottom: 0,

                    justifyContent: 'center',
                  }}>
                  <Icon name="lock" color="#fff" size={DevicePixels[40]} />
                </View>
              ) : (
                <View
                  style={{
                    position: 'absolute',
                    justifyContent: 'center',
                    top: 0,
                    bottom: 0,
                    left: DevicePixels[10],
                    right: 0,
                    width: DevicePixels[40],
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: colors.appWhite,
                      fontSize: DevicePixels[12],
                      ...globalStyles.textShadow,
                    }}>
                    Under
                  </Text>
                  <Text
                    category="h6"
                    style={{
                      color: colors.appWhite,
                      ...globalStyles.textShadow,
                    }}>
                    {item.duration}
                  </Text>
                  <Text
                    style={{
                      color: colors.appWhite,
                      fontSize: DevicePixels[12],
                      ...globalStyles.textShadow,
                    }}>
                    mins
                  </Text>
                </View>
              )}
              <View
                style={{
                  position: 'absolute',
                  justifyContent: 'center',
                  top: 0,
                  left: DevicePixels[55],
                  right: 0,
                  bottom: 0,
                }}>
                <Text
                  category="h6"
                  style={{color: colors.appWhite, ...globalStyles.textShadow}}>
                  {item.name}
                </Text>
                <Text
                  category="s1"
                  style={{color: colors.appWhite, ...globalStyles.textShadow}}>
                  {`${getLevelString(item.level)} - ${getEquipmentString(
                    item.equipment,
                  )} - ${getFocusString(item.focus)}`}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <AbsoluteSpinner loading={loading} />
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
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutList);
