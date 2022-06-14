import {NativeModules, NativeEventEmitter} from 'react-native';

const {RNiTunes} = NativeModules;
export const AppleMusicListener = new NativeEventEmitter(RNiTunes);

const defaultGetCurrentTrackOptions = {
  playerType: 'system',
  includeArtwork: true,
};

export interface Track {
  title: string;
  albumTitle: string;
  artwork: string;
  albumArtist: string;
  genre: string;
  duration: number;
  playCount: number;
}

export type PlaybackState = 'playing' | 'paused' | 'stopped';

export default {
  getPlaylists: function (params?: any) {
    return new Promise(resolve => {
      RNiTunes.getPlaylists(params || {}, (playlists: any) => {
        resolve(playlists);
      });
    });
  },

  getTracks: function (params?: any) {
    return new Promise(resolve => {
      RNiTunes.getTracks(params || {}, (tracks: Track[]) => {
        resolve(tracks);
      });
    });
  },

  getArtists: function (params?: any) {
    return new Promise(resolve => {
      RNiTunes.getArtists(params || {}, (tracks: Track[]) => {
        resolve(tracks);
      });
    });
  },

  getAlbums: function (params?: any) {
    return new Promise(resolve => {
      RNiTunes.getAlbums(params || {}, (tracks: Track[]) => {
        resolve(tracks);
      });
    });
  },

  getCurrentPlayTime: function () {
    return new Promise(resolve => {
      RNiTunes.getCurrentPlayTime((currentPlayTime: number) => {
        resolve(currentPlayTime);
      });
    });
  },

  getCurrentTrack: function (opts?: any) {
    return new Promise((resolve, reject) => {
      const mergedOptions = Object.assign(
        {},
        defaultGetCurrentTrackOptions,
        opts,
      );
      RNiTunes.getCurrentTrack(mergedOptions, (err: Error, track: Track) => {
        if (!err) {
          if (track && track.artwork === '') {
            track.artwork = null;
          }
          resolve(track);
        } else {
          reject(err);
        }
      });
    });
  },

  pause: function () {
    RNiTunes.pause();
  },

  play: function () {
    RNiTunes.play();
  },

  previous: function () {
    RNiTunes.previous();
  },

  next: function () {
    RNiTunes.next();
  },

  playTrack: function (trackItem: Track): Promise<void> {
    return new Promise((resolve, reject) => {
      if (
        !trackItem.hasOwnProperty('title') ||
        !trackItem.hasOwnProperty('albumTitle')
      ) {
        reject(
          'To play a track, you need to send the [title] and the [albumTitle] properties',
        );
        return;
      }
      RNiTunes.playTrack(trackItem || {}, (err: Error) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  },

  playTracks: function (trackItems: Track[]): Promise<void> {
    return new Promise((resolve, reject) => {
      if (Array.isArray(trackItems) === false || trackItems.length === 0) {
        reject('No track item have been found');
        return;
      }
      const isValid = trackItems.every(
        t => t.hasOwnProperty('title') && t.hasOwnProperty('albumTitle'),
      );
      if (isValid === false) {
        reject(
          'All track items should have [title] and [albumTitle] properties',
        );
      }
      RNiTunes.playTracks(trackItems || [], (err: Error) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  },

  seekTo: function (playingTime: number) {
    RNiTunes.seekTo(playingTime);
  },

  stop: function () {
    RNiTunes.stop();
  },

  listenForChanges: function () {
    RNiTunes.listenForChanges();
  },
  getPlaybackState: function (): Promise<string> {
    return new Promise(resolve => {
      RNiTunes.getPlaybackState((state: string) => {
        resolve(state);
      });
    });
  },
};
