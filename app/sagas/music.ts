import {
  all,
  call,
  fork,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';
import {Alert, Linking, Platform} from 'react-native';
import {
  ApiConfig,
  ApiScope,
  auth as SpotifyAuth,
  PlayerState,
  remote as SpotifyRemote,
  SpotifySession,
} from 'react-native-spotify-remote';
import Config from 'react-native-config';
import {
  appleSetNowPlaying,
  appleSetPlaybackState,
  APPLE_NEXT,
  APPLE_PAUSE,
  APPLE_PLAY,
  APPLE_PREVIOUS,
  setAudioApp,
  SetAudioAppAction,
  setMusicLoading,
  setSpotifyAccessToken,
  setSpotifyIsConnected,
  setSpotifyPlayerState,
  SET_AUDIO_APP,
  SpotifySetShufflingAction,
  SPOTIFY_PAUSE,
  SPOTIFY_RESUME,
  SPOTIFY_SET_SHUFFLING,
  SPOTIFY_SKIP_TO_NEXT,
  SPOTIFY_SKIP_TO_PREVIOUS,
} from '../actions/music';
import {logError} from '../helpers/error';
import {eventChannel, EventChannel} from 'redux-saga';
import itunes, {
  AppleMusicListener,
  PlaybackState,
  Track,
} from '../helpers/itunes';
import Snackbar from 'react-native-snackbar';
import {PERMISSIONS, PermissionStatus, request} from 'react-native-permissions';
import {MyRootState} from '../types/Shared';

const spotifyConfig: ApiConfig = {
  clientID: Config.SPOTIFY_CLIENT_ID,
  redirectURL: Config.SPOTIFY_REDIRECT_URL,
  tokenRefreshURL: Config.SPOTIFY_TOKEN_REFRESH_URL,
  tokenSwapURL: Config.SPOTIFY_TOKEN_SWAP_URL,
  scopes: [ApiScope.AppRemoteControlScope, ApiScope.UserFollowReadScope],
};

function onPlayerStateChanged() {
  return eventChannel(emitter => {
    const handlePlayerStateChange = (state: PlayerState) => {
      emitter(state);
    };
    SpotifyRemote.addListener('playerStateChanged', handlePlayerStateChange);
    return () =>
      SpotifyRemote.removeListener(
        'playerStateChanged',
        handlePlayerStateChange,
      );
  });
}

function* spotifySkipToPreviousWorker() {
  yield call(SpotifyRemote.skipToPrevious);
}

function* applePreviousWorker() {
  yield call(itunes.previous);
}

function* spotifySkipToNextWorker() {
  yield call(SpotifyRemote.skipToNext);
}

function* appleNextWorker() {
  yield call(itunes.next);
}

function* spotifyResumeWorker() {
  yield call(SpotifyRemote.resume);
}

function* applePlayWorker() {
  yield call(itunes.play);
}

function* spotifyPauseWorker() {
  yield call(SpotifyRemote.pause);
}

function* applePauseWorker() {
  yield call(itunes.pause);
}

function* spotifySetShufflingWorker(action: SpotifySetShufflingAction) {
  yield call(SpotifyRemote.setShuffling, action.payload);
}

function* playerStateChangedWatcher() {
  const channel: EventChannel<PlayerState> = yield call(onPlayerStateChanged);
  while (true) {
    const state: PlayerState = yield take(channel);
    yield put(setSpotifyPlayerState(state));
    yield call(getAlbumArt, state);
  }
}

function onRemoteConnected() {
  return eventChannel(emitter => {
    const handleOnRemoteConnected = () => {
      emitter({});
    };
    SpotifyRemote.addListener('remoteConnected', handleOnRemoteConnected);
    return () =>
      SpotifyRemote.removeListener('remoteConnected', handleOnRemoteConnected);
  });
}

function* remoteConnectedWatcher() {
  const channel: EventChannel<{}> = yield call(onRemoteConnected);
  while (true) {
    yield take(channel);
    yield put(setSpotifyIsConnected(true));
  }
}

function onRemoteDisconnected() {
  return eventChannel(emitter => {
    const handleOnRemoteDisconnected = () => {
      emitter({});
    };
    SpotifyRemote.addListener('remoteDisconnected', handleOnRemoteDisconnected);
    return () =>
      SpotifyRemote.removeListener(
        'remoteDisconnected',
        handleOnRemoteDisconnected,
      );
  });
}

function* remoteDisconnectedWatcher() {
  const channel: EventChannel<{}> = yield call(onRemoteDisconnected);
  while (true) {
    yield take(channel);
    yield put(setSpotifyIsConnected(false));
  }
}

function onAppleMusicStateChanged() {
  return eventChannel(emitter => {
    const subscription = AppleMusicListener.addListener(
      'stateChanged',
      (state: PlaybackState) => {
        emitter(state);
      },
    );
    return () => subscription.remove();
  });
}

function* appleMusicStateWatcher() {
  const channel: EventChannel<PlaybackState> = yield call(
    onAppleMusicStateChanged,
  );
  while (true) {
    const state: PlaybackState = yield take(channel);
    yield put(appleSetPlaybackState(state));
  }
}

function onAppleMusicNowPlayingChanged() {
  return eventChannel(emitter => {
    const subscription = AppleMusicListener.addListener(
      'nowPlayingChanged',
      () => {
        emitter({});
      },
    );
    return () => subscription.remove();
  });
}

function* appleMusicNowPlayingWatcher() {
  const channel: EventChannel<{}> = yield call(onAppleMusicNowPlayingChanged);
  while (true) {
    yield take(channel);
    const currentTrack: Track = yield call(itunes.getCurrentTrack);
    yield put(appleSetNowPlaying(currentTrack));
  }
}

function* setAudioAppWorker(action: SetAudioAppAction) {
  yield put(setMusicLoading(true));

  if (action.payload === 'spotify') {
    try {
      const isConnected: boolean = yield call(SpotifyRemote.isConnectedAsync);
      yield put(setSpotifyIsConnected(isConnected));
      if (!isConnected) {
        const existingSession: SpotifySession = yield call(
          SpotifyAuth.getSession,
        );
        if (existingSession && existingSession.accessToken) {
          try {
            yield call(SpotifyRemote.connect, existingSession.accessToken);
            yield put(setSpotifyAccessToken(existingSession.accessToken));
            yield put(setSpotifyIsConnected(true));
          } catch (e) {
            yield call(SpotifyRemote.disconnect);
            yield call(SpotifyAuth.endSession);
            const session: SpotifySession = yield call(
              SpotifyAuth.authorize,
              spotifyConfig,
            );

            yield call(SpotifyRemote.connect, session.accessToken);
            yield put(setSpotifyAccessToken(session.accessToken));
            yield put(setSpotifyIsConnected(true));
          }
        } else {
          const session: SpotifySession = yield call(
            SpotifyAuth.authorize,
            spotifyConfig,
          );
          yield call(SpotifyRemote.connect, session.accessToken);
          yield put(setSpotifyAccessToken(session.accessToken));
          yield put(setSpotifyIsConnected(true));
        }
      }
      const state: PlayerState = yield call(SpotifyRemote.getPlayerState);
      yield put(setSpotifyPlayerState(state));
      yield call(getAlbumArt, state);
    } catch (e) {
      Alert.alert(
        'Error connecting to Spotify',
        'Please either start a song in the Spotify app first or fully close the Spotify app, do you want to open Spotify now?',
        [
          {text: 'Yes', onPress: () => Linking.openURL('spotify://')},
          {text: 'No'},
        ],
      );
      yield put(setAudioApp(undefined));
      logError(e);
    }
  }

  if (action.payload === 'apple_music') {
    try {
      const permission: PermissionStatus = yield call(
        request,
        PERMISSIONS.IOS.MEDIA_LIBRARY,
      );
      if (permission === 'granted') {
        const currentTrack: Track = yield call(itunes.getCurrentTrack);
        if (currentTrack) {
          yield put(appleSetNowPlaying(currentTrack));
        } else {
          const tracks: Track[] = yield call(itunes.getTracks);
          if (tracks.length) {
            yield put(appleSetNowPlaying(tracks[0]));
          } else {
            Snackbar.show({text: 'Error fetching track from Apple Music'});
          }
        }
        const state: PlaybackState = yield call(itunes.getPlaybackState);
        yield put(appleSetPlaybackState(state));
      } else {
        yield put(setAudioApp(undefined));
        Alert.alert(
          'Error',
          'CA Health does not have access to music library, you can change this via your settings, do you wish to go there now?',
          [{text: 'Yes', onPress: () => Linking.openSettings()}, {text: 'No'}],
        );
      }
    } catch (e) {
      yield put(setAudioApp(undefined));
      Snackbar.show({text: 'Error: error initializing Apple Music'});
    }
  }

  yield put(setMusicLoading(false));
}

function* getAlbumArt(state: PlayerState) {
  try {
    const {uri} = state.track.album;
    const {spotifyAccessToken} = yield select(
      (state: MyRootState) => state.music,
    );
    debugger;
    const response: Response = yield call(
      fetch,
      `https://api.spotify.com/v1/albums/${uri}`,
      {
        headers: {
          Authorization: spotifyAccessToken,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (e) {
    logError(e);
  }
}

export default function* musicSaga() {
  yield all([
    takeLatest(SET_AUDIO_APP, setAudioAppWorker),
    takeLatest(SPOTIFY_SKIP_TO_PREVIOUS, spotifySkipToPreviousWorker),
    takeLatest(SPOTIFY_SKIP_TO_NEXT, spotifySkipToNextWorker),
    takeLatest(SPOTIFY_RESUME, spotifyResumeWorker),
    takeLatest(SPOTIFY_PAUSE, spotifyPauseWorker),
    takeLatest(SPOTIFY_SET_SHUFFLING, spotifySetShufflingWorker),
    takeLatest(APPLE_NEXT, appleNextWorker),
    takeLatest(APPLE_PREVIOUS, applePreviousWorker),
    takeLatest(APPLE_PLAY, applePlayWorker),
    takeLatest(APPLE_PAUSE, applePauseWorker),
  ]);

  yield fork(playerStateChangedWatcher);
  yield fork(remoteConnectedWatcher);
  yield fork(remoteDisconnectedWatcher);
  if (Platform.OS === 'ios') {
    yield fork(appleMusicNowPlayingWatcher);
    yield fork(appleMusicStateWatcher);
    yield fork(itunes.listenForChanges);
  }
}
