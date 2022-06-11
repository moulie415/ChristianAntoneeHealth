import {Platform, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import DevicePixels from '../../helpers/DevicePixels';
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import globalStyles from '../../styles/globalStyles';
import Animated, {SlideOutUp, SlideInUp} from 'react-native-reanimated';
import {AudioApp} from '../../reducers/music';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import {setAudioApp} from '../../actions/music';
import {Spinner} from '@ui-kitten/components';
import Text from './Text';
import {PlayerState} from 'react-native-spotify-remote';

const audioApps: AudioApp[] = ['spotify', 'apple_music'];

const MusicButton: React.FC<{
  audioApp?: AudioApp;
  loading: boolean;
  spotifyIsConnected: boolean;
  spotifyPlayerState?: PlayerState;
  setAudioApp: (app: AudioApp) => void;
}> = ({
  audioApp,
  loading,
  spotifyIsConnected,
  spotifyPlayerState,
  setAudioApp: setAudioAppAction,
}) => {
  console.log(spotifyPlayerState);
  const [showMenu, setShowMenu] = useState(false);
  const [showAudioApps, setShowAudioApps] = useState(!audioApp);
  console.log(spotifyIsConnected);
  const renderMusicUI = () => {
    if (loading) {
      return (
        <View>
          <Spinner />
        </View>
      );
    }
    if (spotifyIsConnected) {
      <View>
        <Text>Spotify !!!</Text>
      </View>;
    }
    if (showAudioApps) {
      return (
        <View style={{flex: 1}}>
          <Text>Select an audio app</Text>
          <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
            {audioApps.map(app => {
              if (app === 'apple_music' && Platform.OS === 'android') {
                return null;
              }
              if (app === 'spotify') {
                return (
                  <TouchableOpacity
                    key={app}
                    onPress={() => setAudioAppAction(app)}
                    style={{margin: DevicePixels[20]}}>
                    <Icon
                      name="spotify"
                      color={colors.spotify}
                      size={DevicePixels[60]}
                    />
                  </TouchableOpacity>
                );
              }
              if (app === 'apple_music') {
                return (
                  <TouchableOpacity key={app}>
                    <Icon
                      name="apple"
                      color={colors.appBlack}
                      size={DevicePixels[30]}
                    />
                  </TouchableOpacity>
                );
              }
            })}
          </View>
        </View>
      );
    }

    return <View />;
  };
  return (
    <>
      <TouchableOpacity
        onPress={() => setShowMenu(true)}
        style={{
          position: 'absolute',
          top: DevicePixels[20],
          right: DevicePixels[20],
          height: DevicePixels[50],
          width: DevicePixels[50],
          borderRadius: DevicePixels[25],
          backgroundColor: colors.appBlue,
          alignItems: 'center',
          justifyContent: 'center',
          ...globalStyles.boxShadow,
        }}>
        <Icon name="music" color={colors.appWhite} size={DevicePixels[20]} />
      </TouchableOpacity>
      {showMenu && (
        <Animated.View
          entering={SlideInUp}
          exiting={SlideOutUp}
          style={{
            backgroundColor: colors.appWhite,
            top: 0,
            right: 0,
            left: 0,
            position: 'absolute',
            height: DevicePixels[150],
            ...globalStyles.boxShadow,
          }}>
          {renderMusicUI()}
          <TouchableOpacity
            onPress={() => setShowMenu(false)}
            style={{
              position: 'absolute',
              bottom: -DevicePixels[20],
              right: DevicePixels[20],
              height: DevicePixels[40],
              width: DevicePixels[40],
              borderRadius: DevicePixels[20],
              backgroundColor: colors.appBlue,
              alignItems: 'center',
              justifyContent: 'center',
              ...globalStyles.boxShadow,
            }}>
            <Icon
              name="chevron-up"
              color={colors.appWhite}
              size={DevicePixels[25]}
            />
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  );
};

const mapStateToProps = ({music}: MyRootState) => ({
  audioApp: music.audioApp,
  loading: music.loading,
  spotifyPlayerState: music.spotifyPlayerState,
  spotifyIsConnected: music.spotifyIsConnected,
});

const mapDispatchToProps = {
  setAudioApp,
};

export default connect(mapStateToProps, mapDispatchToProps)(MusicButton);
