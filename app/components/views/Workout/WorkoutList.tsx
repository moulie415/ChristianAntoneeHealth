import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import {RouteProp} from '@react-navigation/native';
import {List, ListItem} from '@ui-kitten/components';
import {connect} from 'react-redux';
import {Goal, Level, MyRootState} from '../../../types/Shared';
import QuickRoutine, {Equipment} from '../../../types/QuickRoutines';
import {getQuickRoutines} from '../../../actions/quickRoutines';
import Text from '../../commons/Text';
import ImageOverlay from '../../commons/ImageOverlay';
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
}> = ({
  navigation,
  route,
  getQuickRoutines: getQuickRoutinesAction,
  quickRoutines,
  getExercisesById: getExercisesByIdAction,
  profile,
  settings,
}) => {
  const {goal, experience, equipment} = route.params;
  const {adLoaded, adDismissed, show} = useInterstitialAd(UNIT_ID_INTERSTITIAL);
  const [selectedItem, setSelectedItem] = useState<QuickRoutine>();

  useEffect(() => {
    getQuickRoutinesAction();
  }, [getQuickRoutinesAction]);

  useEffect(() => {
    if (adDismissed && selectedItem) {
      getExercisesByIdAction(selectedItem.exerciseIds);
      navigation.navigate('QuickRoutine', {routine: selectedItem});
    }
  }, [adDismissed, navigation, selectedItem, getExercisesByIdAction]);

  const filtered = Object.values(quickRoutines).filter(routine => {
    return (
      routine.focus === goal &&
      routine.level === experience &&
      routine.equipment === equipment
    );
  });

  return (
    <View>
      <List
        data={Object.values(quickRoutines)}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              onPress={() => {}}
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
              {item.premium && !profile.premium && (
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
              )}
              <View
                style={{
                  position: 'absolute',
    
                
                }}>
                <Text
                  category="h5"
                  style={[globalStyles.textShadow, {color: '#fff'}]}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          );

          // <>
          //   <ListItem
          //     onPress={() => {
          //       if (item.premium && !profile.premium) {
          //         navigation.navigate('Premium');
          //       } else if (adLoaded && !profile.premium && settings.ads) {
          //         setSelectedItem(item);
          //         show();
          //       } else {
          //         getExercisesByIdAction(item.exerciseIds);
          //         navigation.navigate('QuickRoutine', {routine: item});
          //       }
          //     }}
          //     title={item.name}
          //     description={`${getLevelString(
          //       item.level,
          //     )} - ${getEquipmentString(item.equipment)} - ${getFocusString(
          //       item.focus,
          //     )}`}
          //     accessoryLeft={() =>
          //       !item.premium || profile.premium ? (
          //         <ImageOverlay
          //           containerStyle={{
          //             height: DevicePixels[75],
          //             width: DevicePixels[75],
          //           }}
          //           overlayAlpha={0.4}
          //           source={
          //             item.thumbnail
          //               ? {uri: item.thumbnail.src}
          //               : require('../../../images/Homepage_quick_routine.jpeg')
          //           }>
          //           <View style={{alignItems: 'center'}}>
          //             <Text
          //               style={{
          //                 color: colors.appWhite,
          //                 fontSize: DevicePixels[12],
          //               }}>
          //               {'Under '}
          //             </Text>
          //             <Text category="h6" style={{color: colors.appWhite}}>
          //               {item.duration}
          //             </Text>
          //             <Text
          //               style={{
          //                 color: colors.appWhite,
          //                 fontSize: DevicePixels[12],
          //               }}>
          //               mins
          //             </Text>
          //           </View>
          //         </ImageOverlay>
          //       ) : (
          //         <View
          //           style={{
          //             height: DevicePixels[50],
          //             width: DevicePixels[75],
          //             alignItems: 'center',
          //             justifyContent: 'center',
          //           }}>
          //           <Icon name="lock" size={DevicePixels[30]} />
          //         </View>
          //       )
          //     }
          //   />
          //   {item.premium && !profile.premium && (
          //     <TouchableOpacity
          //       onPress={() => navigation.navigate('Premium')}
          //       style={{
          //         ...StyleSheet.absoluteFillObject,
          //         backgroundColor: '#000',
          //         opacity: 0.5,
          //       }}
          //     />
          //   )}
          // </>
        }}
      />
    </View>
  );
};

const mapStateToProps = ({quickRoutines, profile, settings}: MyRootState) => ({
  quickRoutines: quickRoutines.quickRoutines,
  profile: profile.profile,
  settings,
});

const mapDispatchToProps = {
  getQuickRoutines,
  getExercisesById,
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutList);
