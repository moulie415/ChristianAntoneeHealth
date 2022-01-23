import {List, ListItem, Text, Layout} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import QuickRoutine, {Equipment} from '../../types/QuickRoutines';
import {Goal, Level, MyRootState} from '../../types/Shared';
import ImageOverlay from './ImageOverlay';
import {QuickRoutinesListNavigationProp} from '../../types/views/QuickRoutinesList';
import DevicePixels from '../../helpers/DevicePixels';
import {useInterstitialAd} from '@react-native-admob/admob';
import {UNIT_ID_INTERSTITIAL} from '../../constants';
import {connect} from 'react-redux';
import Profile from '../../types/Profile';
import styles from '../../styles/commons/QuickRoutinesList';
import {SettingsState} from '../../reducers/settings';
import {getExercisesById} from '../../actions/exercises';

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
  if (focus === Goal.BONE_DENSITY) {
    return 'Balance';
  }
  if (focus === Goal.CORE) {
    return 'Intensity';
  }
  if (focus === Goal.WEIGHT) {
    return 'Mobility';
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

const QuickRoutinesList: React.FC<{
  routines: QuickRoutine[];
  navigation: QuickRoutinesListNavigationProp;
  profile: Profile;
  settings: SettingsState;
  getExercisesByIdAction: (ids: string[]) => void;
}> = ({routines, navigation, profile, settings, getExercisesByIdAction}) => {
  const {adLoaded, adDismissed, show} = useInterstitialAd(UNIT_ID_INTERSTITIAL);
  const [selectedItem, setSelectedItem] = useState<QuickRoutine>();

  useEffect(() => {
    if (adDismissed && selectedItem) {
      getExercisesByIdAction(selectedItem.exerciseIds);
      navigation.navigate('QuickRoutine', {routine: selectedItem});
    }
  }, [adDismissed, navigation, selectedItem, getExercisesByIdAction]);
  return (
    <Layout style={styles.flex}>
      <Text appearance="hint" style={styles.padding}>
        {`${routines.length} ${routines.length === 1 ? 'routine' : 'routines'}`}
      </Text>

      <List
        style={styles.flex}
        data={routines}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <>
              <ListItem
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
                title={item.name}
                description={`${getLevelString(
                  item.level,
                )} - ${getEquipmentString(item.equipment)} - ${getFocusString(
                  item.focus,
                )}`}
                accessoryLeft={() =>
                  !item.premium || profile.premium ? (
                    <ImageOverlay
                      containerStyle={styles.imageContainer}
                      overlayAlpha={0.4}
                      source={
                        item.thumbnail
                          ? {uri: item.thumbnail.src}
                          : require('../../images/old_man_stretching.jpeg')
                      }>
                      <View style={styles.center}>
                        <Text style={styles.routineText}>{'Under '}</Text>
                        <Text category="h6" style={styles.textWhite}>
                          {item.duration}
                        </Text>
                        <Text style={styles.routineText}>mins</Text>
                      </View>
                    </ImageOverlay>
                  ) : (
                    <View style={styles.lockIcon}>
                      <Icon name="lock" size={DevicePixels[30]} />
                    </View>
                  )
                }
              />
              {item.premium && !profile.premium && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Premium')}
                  style={styles.overlay}
                />
              )}
            </>
          );
        }}
      />
    </Layout>
  );
};

const mapStateToProps = ({profile, settings}: MyRootState) => ({
  profile: profile.profile,
  settings,
});

const mapDispatchToProps = {
  getExercisesByIdAction: getExercisesById,
};

export default connect(mapStateToProps, mapDispatchToProps)(QuickRoutinesList);
