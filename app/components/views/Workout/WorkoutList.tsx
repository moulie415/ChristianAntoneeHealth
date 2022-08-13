import {
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import {RouteProp} from '@react-navigation/native';
import {connect} from 'react-redux';
import {Goal, Level, MyRootState} from '../../../types/Shared';
import QuickRoutine, {Equipment} from '../../../types/QuickRoutines';
import {
  getQuickRoutines,
  startQuickRoutine,
} from '../../../actions/quickRoutines';
import Text from '../../commons/Text';
import {AD_KEYWORDS, UNIT_ID_INTERSTITIAL} from '../../../constants';
import {getExercisesById} from '../../../actions/exercises';
import DevicePixels from '../../../helpers/DevicePixels';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Profile from '../../../types/Profile';
import {SettingsState} from '../../../reducers/settings';
import colors from '../../../constants/colors';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import {SafeAreaView} from 'react-native-safe-area-context';
import Exercise from '../../../types/Exercise';
import {useInterstitialAd} from 'react-native-google-mobile-ads';
import Header from '../../commons/Header';

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

  const {load, show, isLoaded, isClosed} = useInterstitialAd(
    UNIT_ID_INTERSTITIAL,
    {
      keywords: AD_KEYWORDS,
    },
  );

  useEffect(() => {
    if (settings.ads) {
      load();
    }
  }, [settings.ads, load]);

  useEffect(() => {
    if (isClosed && settings.ads) {
      load();
    }
  }, [isClosed, load, settings.ads]);

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
    if (isClosed && selectedItem) {
      getExercisesByIdAction(selectedItem.exerciseIds);
      navigation.navigate('QuickRoutine', {routine: selectedItem});
      startQuickRoutineAction(selectedItem);
    }
  }, [
    isClosed,
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

  const getImage = (level: Level) => {
    if (level === Level.INTERMEDIATE) {
      return require('../../../images/intermediate.jpg');
    }
    if (level === Level.ADVANCED) {
      return require('../../../images/advanced.jpg');
    }
    return require('../../../images/beginner.jpg');
  };

  return (
    <ImageBackground
      source={require('../../../images/old-black-background-grunge.png')}
      blurRadius={5}
      style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <Header hasBack />
        <FlatList
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
                  } else if (isLoaded && !profile.premium && settings.ads) {
                    setSelectedItem(item);
                    show();
                  } else {
                    getExercisesByIdAction(item.exerciseIds);
                    navigation.navigate('QuickRoutine', {routine: item});
                    startQuickRoutineAction(item);
                  }
                }}
                key={item.id}>
                <ImageBackground
                  style={{
                    height: DevicePixels[120],
                    marginHorizontal: DevicePixels[10],
                    marginBottom: DevicePixels[10],
                  }}
                  borderRadius={DevicePixels[10]}
                  source={getImage(item.level)}>
                  <ImageBackground
                    source={require('../../../images/BlackTransparentBackground.png')}
                    blurRadius={3}
                    style={{
                      height: DevicePixels[120],
                      justifyContent: 'center',
                      padding: DevicePixels[10],
                    }}
                    borderRadius={DevicePixels[10]}>
                    {locked ? (
                      <View style={{}}>
                        <Icon
                          name="lock"
                          color="#fff"
                          size={DevicePixels[40]}
                        />
                      </View>
                    ) : (
                      <View style={{marginBottom: DevicePixels[5]}}>
                        <Text
                          style={{
                            color: colors.appWhite,
                            fontSize: DevicePixels[12],
                          }}>
                          Under
                        </Text>
                        <Text
                          style={{
                            color: colors.appWhite,
                            fontSize: DevicePixels[12],
                          }}>
                          <Text style={{fontWeight: 'bold'}}>
                            {item.duration}
                          </Text>
                          {' mins'}
                        </Text>
                      </View>
                    )}
                    <View
                      style={{
                        width: DevicePixels[220],
                      }}>
                      <Text
                        style={{
                          color: colors.appWhite,
                          fontSize: DevicePixels[16],
                          fontWeight: 'bold',
                          marginBottom: DevicePixels[5],
                        }}>
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          color: colors.appWhite,
                          fontSize: DevicePixels[12],
                        }}>
                        {`${getLevelString(item.level)} - ${getEquipmentString(
                          item.equipment,
                        )} - ${getFocusString(item.focus)}`}
                      </Text>
                    </View>
                  </ImageBackground>
                </ImageBackground>
              </TouchableOpacity>
            );
          }}
        />
        <AbsoluteSpinner loading={loading} />
      </SafeAreaView>
    </ImageBackground>
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
