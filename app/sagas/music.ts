import {all, call, put, select, takeLatest} from 'redux-saga/effects';
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
  setSpotifyToken,
  SET_AUDIO_APP,
} from '../actions/music';
import {Alert} from 'react-native';
import Snackbar from 'react-native-snackbar';
import {MyRootState} from '../types/Shared';
import {logError} from '../helpers/error';

const spotifyConfig: ApiConfig = {
  clientID: Config.SPOTIFY_CLIENT_ID,
  redirectURL: Config.SPOTIFY_REDIRECT_URL,
  tokenRefreshURL: Config.SPOTIFY_TOKEN_REFRESH_URL,
  tokenSwapURL: Config.SPOTIFY_TOKEN_SWAP_URL,
  scopes: [ApiScope.AppRemoteControlScope, ApiScope.UserFollowReadScope],
};

// Initialize the library and connect the Remote
// then play an epic song
async function playEpicSong() {
  try {
    console.log(spotifyConfig);
    const session = await SpotifyAuth.authorize(spotifyConfig);
    await SpotifyRemote.connect(session.accessToken);
    console.log(session);
    const state = await SpotifyRemote.getPlayerState();
    console.log(state);
    // await SpotifyRemote.playUri('spotify:track:6IA8E2Q5ttcpbuahIejO74');
    //await SpotifyRemote.seek(58000);
  } catch (err) {
    console.error("Couldn't authorize if or connect to Spotify", err);
  }
}

function* setAudioAppWorker(action: SetAudioAppAction) {
  yield put(setMusicLoading(true));
  try {
    if (action.payload === 'spotify') {
      const isConnected: boolean = yield call(SpotifyRemote.isConnectedAsync);
      yield put(setSpotifyIsConnected(isConnected));
      if (!isConnected) {
        const {spotifyToken} = yield select(
          (state: MyRootState) => state.music,
        );
        if (spotifyToken) {
          try {
            yield call(SpotifyRemote.connect, spotifyToken);
          } catch (e) {
            const session: SpotifySession = yield call(
              SpotifyAuth.authorize,
              spotifyConfig,
            );
            yield put(setSpotifyToken(session.accessToken));
            yield call(SpotifyRemote.connect, session.accessToken);
            yield put(setSpotifyToken(session.accessToken));
            yield put(setSpotifyIsConnected(true));
          }
        } else {
          const session: SpotifySession = yield call(
            SpotifyAuth.authorize,
            spotifyConfig,
          );
          yield put(setSpotifyToken(session.accessToken));
          yield call(SpotifyRemote.connect, session.accessToken);
          yield put(setSpotifyIsConnected(true));
        }
      }
      const state: PlayerState = yield call(SpotifyRemote.getPlayerState);
      yield put(setSpotifyPlayerState(state));
    }
  } catch (e) {
    logError(e);
    Snackbar.show({text: `Error: ${e.message}`});
  }

  yield put(setMusicLoading(false));
}

export default function* musicSaga() {
  yield all([takeLatest(SET_AUDIO_APP, setAudioAppWorker)]);
}
