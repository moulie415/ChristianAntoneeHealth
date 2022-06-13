import {all, call, fork, put, take, takeLatest} from 'redux-saga/effects';
import {Alert} from 'react-native';
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
  SetAudioAppAction,
  setMusicLoading,
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

function* spotifySkipToNextWorker() {
  yield call(SpotifyRemote.skipToNext);
}

function* spotifyResumeWorker() {
  yield call(SpotifyRemote.resume);
}

function* spotifyPauseWorker() {
  yield call(SpotifyRemote.pause);
}
function* spotifySetShufflingWorker(action: SpotifySetShufflingAction) {
  yield call(SpotifyRemote.setShuffling, action.payload);
}

function* playerStateChangedWatcher() {
  const channel: EventChannel<PlayerState> = yield call(onPlayerStateChanged);
  while (true) {
    const state: PlayerState = yield take(channel);
    yield put(setSpotifyPlayerState(state));
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

function* remoteConnectedWorker() {
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

function* remoteDisconnectedWorker() {
  const channel: EventChannel<{}> = yield call(onRemoteDisconnected);
  while (true) {
    yield take(channel);
    yield put(setSpotifyIsConnected(false));
  }
}

function* setAudioAppWorker(action: SetAudioAppAction) {
  yield put(setMusicLoading(true));
  try {
    if (action.payload === 'spotify') {
      const isConnected: boolean = yield call(SpotifyRemote.isConnectedAsync);
      yield put(setSpotifyIsConnected(isConnected));
      if (!isConnected) {
        const existingSession: SpotifySession = yield call(
          SpotifyAuth.getSession,
        );
        if (existingSession && existingSession.accessToken) {
          try {
            yield call(SpotifyRemote.connect, existingSession.accessToken);
          } catch (e) {
            yield call(SpotifyRemote.disconnect);
            yield call(SpotifyAuth.endSession);
            const session: SpotifySession = yield call(
              SpotifyAuth.authorize,
              spotifyConfig,
            );

            yield call(SpotifyRemote.connect, session.accessToken);
          }
        } else {
          const session: SpotifySession = yield call(
            SpotifyAuth.authorize,
            spotifyConfig,
          );
          yield call(SpotifyRemote.connect, session.accessToken);
        }
      }
      const state: PlayerState = yield call(SpotifyRemote.getPlayerState);
      yield put(setSpotifyPlayerState(state));
    }
  } catch (e) {
    logError(e);
    Alert.alert(
      'Error connecting to Spotify',
      'Please either start a song in the Spotify app first or fully close the Spotify app',
    );
  }

  yield put(setMusicLoading(false));
}

export default function* musicSaga() {
  yield all([
    takeLatest(SET_AUDIO_APP, setAudioAppWorker),
    takeLatest(SPOTIFY_SKIP_TO_PREVIOUS, spotifySkipToPreviousWorker),
    takeLatest(SPOTIFY_SKIP_TO_NEXT, spotifySkipToNextWorker),
    takeLatest(SPOTIFY_RESUME, spotifyResumeWorker),
    takeLatest(SPOTIFY_PAUSE, spotifyPauseWorker),
    takeLatest(SPOTIFY_SET_SHUFFLING, spotifySetShufflingWorker),
  ]);

  yield fork(playerStateChangedWatcher);
  yield fork(remoteConnectedWorker);
  yield fork(remoteDisconnectedWorker);
}
