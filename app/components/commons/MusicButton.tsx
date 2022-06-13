import {Linking, Platform, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import DevicePixels from '../../helpers/DevicePixels';
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import globalStyles from '../../styles/globalStyles';
import Animated, {SlideOutUp, SlideInUp} from 'react-native-reanimated';
import {AudioApp} from '../../reducers/music';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import {
  setAudioApp,
  spotifyPause,
  spotifyResume,
  spotifySetShuffling,
  spotifySkipToNext,
  spotifySkipToPrevious,
} from '../../actions/music';
import {Divider, Spinner} from '@ui-kitten/components';
import Text from './Text';
import {PlayerState, remote} from 'react-native-spotify-remote';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import useInterval from '../../hooks/UseInterval';
import Itunes from '../../helpers/itunes';

const audioApps: AudioApp[] = ['spotify', 'apple_music'];

const MusicButton: React.FC<{
  audioApp?: AudioApp;
  loading: boolean;
  spotifyIsConnected: boolean;
  spotifyPlayerState?: PlayerState;
  setAudioApp: (app: AudioApp) => void;
  spotifyResume: () => void;
  spotifyPause: () => void;
  spotifySkipToNext: () => void;
  spotifySkipToPrevious: () => void;
  spotifySetShuffling: (shuffling: boolean) => void;
}> = ({
  audioApp,
  loading,
  spotifyIsConnected,
  spotifyPlayerState,
  setAudioApp: setAudioAppAction,
  spotifyPause: spotifyPauseAction,
  spotifyResume: spotifyResumeAction,
  spotifySetShuffling: spotifySetShufflingAction,
  spotifySkipToNext: spotifySkipToNextAction,
  spotifySkipToPrevious: spotifySkipToPreviousAction,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showAudioApps, setShowAudioApps] = useState(!spotifyIsConnected);

  useInterval(() => {
    if (spotifyIsConnected) {
      remote.getPlayerState();
    }
  }, 1000);

  const AppList = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={{color: colors.appWhite, padding: DevicePixels[10]}}>
          Select an audio app
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {audioApps.map(app => {
            if (app === 'apple_music' && Platform.OS === 'android') {
              return null;
            }
            if (app === 'spotify') {
              return (
                <TouchableOpacity
                  key={app}
                  onPress={() => {
                    if (audioApp !== 'spotify') {
                      setAudioAppAction(app);
                    }
                    setShowAudioApps(false);
                  }}
                  style={{margin: DevicePixels[20]}}>
                  <Icon
                    name="spotify"
                    color={colors.spotify}
                    size={DevicePixels[60]}
                  />
                  <Text
                    style={{color: colors.appWhite, margin: DevicePixels[5]}}>
                    Spotify
                  </Text>
                </TouchableOpacity>
              );
            }
            if (app === 'apple_music') {
              return (
                <TouchableOpacity
                  key={app}
                  onPress={() => {
                    Itunes.getCurrentTrack().then(track => console.log(track))
                  }}>
                  <Icon
                    name="apple"
                    color={colors.appGrey}
                    size={DevicePixels[30]}
                  />
                </TouchableOpacity>
              );
            }
          })}
        </View>
      </View>
    );
  };

  const renderMusicUI = () => {
    if (loading) {
      return (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Spinner size="giant" />
        </View>
      );
    }

    if (showAudioApps) {
      return <AppList />;
    }

    if (spotifyIsConnected) {
      const getShuffleColor = () => {
        if (spotifyPlayerState.playbackOptions.isShuffling) {
          return colors.appBlue;
        }
        if (spotifyPlayerState.playbackRestrictions.canToggleShuffle) {
          return colors.appWhite;
        }
        return colors.button;
      };
      return (
        <View style={{}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              style={{padding: DevicePixels[5]}}
              onPress={() => Linking.openURL('spotify://')}>
              <Text style={{color: colors.appWhite, fontWeight: 'bold'}}>
                Open Spotify
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{padding: DevicePixels[5]}}
              onPress={() => setShowAudioApps(true)}>
              <Text style={{color: colors.appWhite, fontWeight: 'bold'}}>
                Audio apps
              </Text>
            </TouchableOpacity>
          </View>
          <Divider
            style={{
              marginBottom: DevicePixels[10],
              backgroundColor: colors.appGrey,
            }}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flex: 1}} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}>
              <TouchableOpacity
                disabled={
                  !spotifyPlayerState.playbackRestrictions.canSkipPrevious
                }
                onPress={spotifySkipToPreviousAction}>
                <Icon
                  name="step-backward"
                  size={DevicePixels[30]}
                  style={{padding: DevicePixels[20]}}
                  color={
                    spotifyPlayerState.playbackRestrictions.canSkipNext
                      ? colors.appWhite
                      : colors.button
                  }
                />
              </TouchableOpacity>

              <AnimatedCircularProgress
                style={{alignSelf: 'center'}}
                size={DevicePixels[80]}
                width={DevicePixels[3]}
                backgroundWidth={DevicePixels[3]}
                fill={
                  (100 / spotifyPlayerState.track.duration) *
                  spotifyPlayerState.playbackPosition
                }
                rotation={0}
                tintColor={colors.appBlue}
                backgroundColor={colors.button}
                lineCap="round">
                {fill => (
                  <TouchableOpacity
                    style={{
                      marginRight: spotifyPlayerState.isPaused
                        ? -DevicePixels[5]
                        : 0,
                    }}
                    onPress={
                      spotifyPlayerState.isPaused
                        ? spotifyResumeAction
                        : spotifyPauseAction
                    }>
                    <Icon
                      name={spotifyPlayerState.isPaused ? 'play' : 'pause'}
                      color={colors.appWhite}
                      size={DevicePixels[30]}
                    />
                  </TouchableOpacity>
                )}
              </AnimatedCircularProgress>
              <TouchableOpacity
                disabled={!spotifyPlayerState.playbackRestrictions.canSkipNext}
                onPress={spotifySkipToNextAction}>
                <Icon
                  name="step-forward"
                  color={
                    spotifyPlayerState.playbackRestrictions.canSkipNext
                      ? colors.appWhite
                      : colors.button
                  }
                  size={DevicePixels[30]}
                  style={{padding: DevicePixels[20]}}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignItems: 'flex-end',
                justifyContent: 'center',
                flex: 1,
              }}>
              <TouchableOpacity
                style={{padding: DevicePixels[20]}}
                disabled={
                  !spotifyPlayerState.playbackRestrictions.canToggleShuffle
                }
                onPress={() =>
                  spotifySetShufflingAction(
                    !spotifyPlayerState.playbackOptions.isShuffling,
                  )
                }>
                <Icon
                  name="random"
                  color={getShuffleColor()}
                  size={DevicePixels[30]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return <AppList />;
  };

  const renderButtonIcon = () => {
    if (spotifyIsConnected) {
      return (
        <TouchableOpacity
          onPress={() => setShowMenu(true)}
          style={{
            position: 'absolute',
            top: DevicePixels[20],
            right: DevicePixels[20],

            alignItems: 'center',
            justifyContent: 'center',
            ...globalStyles.boxShadow,
          }}>
          <View
            style={{
              height: DevicePixels[40],
              width: DevicePixels[40],
              borderRadius: 20,
              position: 'absolute',
              backgroundColor: colors.appWhite,
            }}
          />
          <Icon name="spotify" color={colors.spotify} size={DevicePixels[50]} />
        </TouchableOpacity>
      );
    }
    return (
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
    );
  };

  return (
    <>
      {renderButtonIcon()}
      {showMenu && (
        <Animated.View
          entering={Platform.OS === 'ios' ? SlideInUp : undefined}
          exiting={Platform.OS === 'ios' ? SlideOutUp : undefined}
          style={{
            backgroundColor: colors.appBlack,
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
  spotifyResume,
  spotifyPause,
  spotifySkipToNext,
  spotifySkipToPrevious,
  spotifySetShuffling,
};

export default connect(mapStateToProps, mapDispatchToProps)(MusicButton);
