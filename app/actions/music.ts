import {PlayerState} from 'react-native-spotify-remote';
import {AudioApp} from '../reducers/music';
import {SetLoggedInAction} from './profile';

export const SET_AUDIO_APP = 'SET_AUDIO_APP';
export const SET_MUSIC_LOADING = 'SET_MUSIC_LOADING';
export const SET_SPOTIFY_PLAYER_STATE = 'SET_SPOTIFY_PLAYER_STATE';
export const SET_SPOTIFY_IS_CONNECTED = 'SET_SPOTIFY_IS_CONNECTED';
export const SPOTIFY_SKIP_TO_PREVIOUS = 'SPOTIFY_SKIP_TO_PREVIOUS';
export const SPOTIFY_SKIP_TO_NEXT = 'SPOTIFY_SKIP_TO_NEXT';
export const SPOTIFY_RESUME = 'SPOTIFY_RESUME';
export const SPOTIFY_PAUSE = 'SPOTIFY_PAUSE';
export const SPOTIFY_SET_SHUFFLING = 'SPOTIFY_SET_SHUFFLING';

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

export interface SpotifySkipToPreviousAction {
  type: typeof SPOTIFY_SKIP_TO_PREVIOUS;
}

export interface SpotifySkipToNextAction {
  type: typeof SPOTIFY_SKIP_TO_NEXT;
}

export interface SpotifyResumeAction {
  type: typeof SPOTIFY_RESUME;
}

export interface SpotifyPauseAction {
  type: typeof SPOTIFY_PAUSE;
}

export interface SpotifySetShufflingAction {
  type: typeof SPOTIFY_SET_SHUFFLING;
  payload: boolean;
}

export type MusicActions =
  | SetAudioAppAction
  | SetMusicLoadingAction
  | SetSpotifyPlayerStateAction
  | SetSpotifyIsConnectedAction
  | SetLoggedInAction
  | SpotifySkipToNextAction
  | SpotifySkipToPreviousAction
  | SpotifySetShufflingAction
  | SpotifyResumeAction
  | SpotifyPauseAction;

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

export const spotifySkipToNext = (): SpotifySkipToNextAction => ({
  type: SPOTIFY_SKIP_TO_NEXT,
});

export const spotifySkipToPrevious = (): SpotifySkipToPreviousAction => ({
  type: SPOTIFY_SKIP_TO_PREVIOUS,
});

export const spotifySetShuffling = (
  payload: boolean,
): SpotifySetShufflingAction => ({
  type: SPOTIFY_SET_SHUFFLING,
  payload,
});

export const spotifyResume = (): SpotifyResumeAction => ({
  type: SPOTIFY_RESUME,
});

export const spotifyPause = (): SpotifyPauseAction => ({
  type: SPOTIFY_PAUSE,
});
