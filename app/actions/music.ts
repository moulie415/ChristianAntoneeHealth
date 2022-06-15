import {PlayerState} from 'react-native-spotify-remote';
import {PlaybackState, Track} from '../helpers/itunes';
import {AudioApp} from '../reducers/music';
import {SetLoggedInAction} from './profile';

export const SET_AUDIO_APP = 'SET_AUDIO_APP';
export const SET_MUSIC_LOADING = 'SET_MUSIC_LOADING';
export const SET_SPOTIFY_ACCESS_TOKEN = 'SET_SPOTIFY_ACCESS_TOKEN';
export const SET_SPOTIFY_PLAYER_STATE = 'SET_SPOTIFY_PLAYER_STATE';
export const SET_SPOTIFY_IS_CONNECTED = 'SET_SPOTIFY_IS_CONNECTED';
export const SPOTIFY_SKIP_TO_PREVIOUS = 'SPOTIFY_SKIP_TO_PREVIOUS';
export const SPOTIFY_SKIP_TO_NEXT = 'SPOTIFY_SKIP_TO_NEXT';
export const SPOTIFY_RESUME = 'SPOTIFY_RESUME';
export const SPOTIFY_PAUSE = 'SPOTIFY_PAUSE';
export const SPOTIFY_SET_SHUFFLING = 'SPOTIFY_SET_SHUFFLING';
export const APPLE_SET_NOW_PLAYING = 'APPLE_SET_NOW_PLAYING';
export const APPLE_SET_PLAYBACK_STATE = 'APPLE_SET_PLAYBACK_STATE';
export const APPLE_NEXT = 'APPLE_NEXT';
export const APPLE_PREVIOUS = 'APPLE_PREVIOUS';
export const APPLE_PLAY = 'APPLE_PLAY';
export const APPLE_PAUSE = 'APPLE_PAUSE';

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

export interface AppleSetNowPlayingAction {
  type: typeof APPLE_SET_NOW_PLAYING;
  payload: Track;
}

export interface AppleSetPlaybackStateAction {
  type: typeof APPLE_SET_PLAYBACK_STATE;
  payload: PlaybackState;
}

export interface AppleNextAction {
  type: typeof APPLE_NEXT;
}

export interface ApplePreviousAction {
  type: typeof APPLE_PREVIOUS;
}

export interface ApplePlayAction {
  type: typeof APPLE_PLAY;
}

export interface ApplePauseAction {
  type: typeof APPLE_PAUSE;
}

export interface SetSpotifyAccessTokenAction {
  type: typeof SET_SPOTIFY_ACCESS_TOKEN;
  payload: string;
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
  | SpotifyPauseAction
  | AppleSetNowPlayingAction
  | AppleSetPlaybackStateAction
  | AppleNextAction
  | ApplePreviousAction
  | ApplePlayAction
  | ApplePauseAction
  | SetSpotifyAccessTokenAction;

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

export const appleSetNowPlaying = (
  payload: Track,
): AppleSetNowPlayingAction => ({
  type: APPLE_SET_NOW_PLAYING,
  payload,
});

export const appleSetPlaybackState = (
  payload: PlaybackState,
): AppleSetPlaybackStateAction => ({
  type: APPLE_SET_PLAYBACK_STATE,
  payload,
});

export const appleNext = (): AppleNextAction => ({
  type: APPLE_NEXT,
});

export const applePrevious = (): ApplePreviousAction => ({
  type: APPLE_PREVIOUS,
});

export const applePlay = (): ApplePlayAction => ({
  type: APPLE_PLAY,
});

export const applePause = (): ApplePauseAction => ({
  type: APPLE_PAUSE,
});

export const setSpotifyAccessToken = (
  payload: string,
): SetSpotifyAccessTokenAction => ({
  type: SET_SPOTIFY_ACCESS_TOKEN,
  payload,
});
