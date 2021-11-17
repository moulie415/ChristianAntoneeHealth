import {List, ListItem, Text, Layout} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import QuickRoutine, {Equipment, Focus} from '../../types/QuickRoutines';
import colors from '../../constants/colors';
import {Level, MyRootState} from '../../types/Shared';
import ImageOverlay from './ImageOverlay';
import {QuickRoutinesListNavigationProp} from '../../types/views/QuickRoutinesList';
import DevicePixels from '../../helpers/DevicePixels';
import {useInterstitialAd} from '@react-native-admob/admob';
import {UNIT_ID_INTERSTITIAL} from '../../constants';
import {connect} from 'react-redux';
import Profile from '../../types/Profile';

const getEquipmentString = (equipment: Equipment) => {
  if (equipment === 'full') {
    return 'Full Equipment';
  }
  if (equipment === 'minimal') {
    return 'Minimal Equipment';
  }
  return 'No Equipment';
};

const getFocusString = (focus: Focus) => {
  if (focus === 'balance') {
    return 'Balance';
  }
  if (focus === 'intensity') {
    return 'Intensity';
  }
  if (focus === 'mobility') {
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
}> = ({routines, navigation, profile}) => {
  const {adLoaded, adDismissed, show} = useInterstitialAd(UNIT_ID_INTERSTITIAL);
  const [selectedItem, setSelectedItem] = useState<QuickRoutine>();

  useEffect(() => {
    if (adDismissed && selectedItem) {
      navigation.navigate('QuickRoutine', {routine: selectedItem});
    }
  }, [adDismissed, navigation, selectedItem]);
  return (
    <Layout style={{flex: 1}}>
      <Text appearance="hint" style={{padding: DevicePixels[10]}}>
        {`${routines.length} ${routines.length === 1 ? 'routine' : 'routines'}`}
      </Text>

      <List
        style={{flex: 1}}
        data={routines}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <ListItem
              onPress={() => {
                if (adLoaded && !profile.premium) {
                  setSelectedItem(item);
                  show();
                } else {
                  navigation.navigate('QuickRoutine', {routine: item});
                }
              }}
              title={item.name}
              description={`${getLevelString(
                item.level,
              )} - ${getEquipmentString(item.equipment)} - ${getFocusString(
                item.focus,
              )}`}
              accessoryLeft={() => (
                <ImageOverlay
                  containerStyle={{
                    height: DevicePixels[75],
                    width: DevicePixels[75],
                  }}
                  overlayAlpha={0.4}
                  source={
                    item.thumbnail
                      ? {uri: item.thumbnail.src}
                      : require('../../images/old_man_stretching.jpeg')
                  }>
                  <View style={{alignItems: 'center'}}>
                    <Text style={{color: '#fff', fontSize: DevicePixels[12]}}>
                      {'Under '}
                    </Text>
                    <Text category="h6" style={{color: '#fff'}}>
                      {item.duration}
                    </Text>
                    <Text style={{color: '#fff', fontSize: DevicePixels[12]}}>
                      mins
                    </Text>
                  </View>
                </ImageOverlay>
              )}
              accessoryRight={() => (
                <TouchableOpacity style={{padding: DevicePixels[10]}}>
                  <Icon
                    name="ellipsis-h"
                    color={colors.appBlue}
                    size={DevicePixels[20]}
                    onPress={() => 0}
                  />
                </TouchableOpacity>
              )}
            />
          );
        }}
      />
    </Layout>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(QuickRoutinesList);
