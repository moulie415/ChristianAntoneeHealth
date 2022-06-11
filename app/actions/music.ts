import {PlayerState} from 'react-native-spotify-remote';
import {AudioApp} from '../reducers/music';
import {SetLoggedInAction} from './profile';

export const SET_AUDIO_APP = 'SET_AUDIO_APP';
export const SET_MUSIC_LOADING = 'SET_MUSIC_LOADING';
export const SET_SPOTIFY_PLAYER_STATE = 'SET_SPOTIFY_PLAYER_STATE';
export const SET_SPOTIFY_IS_CONNECTED = 'SET_SPOTIFY_IS_CONNECTED';
export const SET_SPOTIFY_TOKEN = 'SET_SPOTIFY_TOKEN';

export interface SetAudioAppAction {
  type: typeof SET_AUDIO_APP;
  payload: AudioApp;
}

export interface SetMusicLoadingAction {
  type: typeof SET_MUSIC_LOADING;
  payload: boolean;
}

export interface SetSpotifyPlayerStateAction {
  type: typeof SET_SPOTIFY_PLAYER_STATE;
  payload: PlayerState;
}

export interface SetSpotifyIsConnectedAction {
  type: typeof SET_SPOTIFY_IS_CONNECTED;
  payload: boolean;
}

export interface SetSpotifyTokenAction {
  type: typeof SET_SPOTIFY_TOKEN;
  payload: string;
}

export type MusicActions =
  | SetAudioAppAction
  | SetMusicLoadingAction
  | SetSpotifyPlayerStateAction
  | SetSpotifyIsConnectedAction
  | SetSpotifyTokenAction
  | SetLoggedInAction;

export const setAudioApp = (payload: AudioApp): SetAudioAppAction => ({
  type: SET_AUDIO_APP,
  payload,
});

export const setMusicLoading = (payload: boolean): SetMusicLoadingAction => ({
  type: SET_MUSIC_LOADING,
  payload,
});

export const setSpotifyPlayerState = (
  payload: PlayerState,
): SetSpotifyPlayerStateAction => ({
  type: SET_SPOTIFY_PLAYER_STATE,
  payload,
});

export const setSpotifyIsConnected = (
  payload: boolean,
): SetSpotifyIsConnectedAction => ({
  type: SET_SPOTIFY_IS_CONNECTED,
  payload,
});

export const setSpotifyToken = (payload: string): SetSpotifyTokenAction => ({
  type: SET_SPOTIFY_TOKEN,
  payload,
});
