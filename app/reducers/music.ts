import {PlayerState} from 'react-native-spotify-remote';
import {
  APPLE_SET_NOW_PLAYING,
  APPLE_SET_PLAYBACK_STATE,
  MusicActions,
  SET_AUDIO_APP,
  SET_MUSIC_LOADING,
  SET_SPOTIFY_ACCESS_TOKEN,
  SET_SPOTIFY_IS_CONNECTED,
  SET_SPOTIFY_PLAYER_STATE,
} from '../actions/music';
import {SET_LOGGED_IN} from '../actions/profile';
import {PlaybackState, Track} from '../helpers/itunes';

export type AudioApp = 'spotify' | 'apple_music';

export interface MusicState {
  audioApp?: AudioApp;
  loading: boolean;
  spotifyPlayerState?: PlayerState;
  spotifyIsConnected: boolean;
  spotifyAccessToken?: string;
  appleNowPlaying?: Track;
  applePlaybackState?: PlaybackState;
}

const initialState: MusicState = {
  loading: false,
  spotifyIsConnected: false,
};

const reducer = (state = initialState, action: MusicActions): MusicState => {
  switch (action.type) {
    case SET_AUDIO_APP:
      return {...state, audioApp: action.payload};
    case SET_MUSIC_LOADING:
      return {...state, loading: action.payload};
    case SET_SPOTIFY_PLAYER_STATE:
      return {...state, spotifyPlayerState: action.payload};
    case SET_SPOTIFY_IS_CONNECTED:
      return {...state, spotifyIsConnected: action.payload};
    case APPLE_SET_NOW_PLAYING:
      return {...state, appleNowPlaying: action.payload};
    case APPLE_SET_PLAYBACK_STATE:
      return {...state, applePlaybackState: action.payload};
    case SET_SPOTIFY_ACCESS_TOKEN:
      return {...state, spotifyAccessToken: action.payload};
    case SET_LOGGED_IN:
      return action.payload ? state : initialState;
    default:
      return state;
  }
};
export default reducer;
