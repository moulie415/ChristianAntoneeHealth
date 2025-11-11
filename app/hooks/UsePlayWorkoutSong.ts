import { useAudioPlayer } from 'expo-audio';
import * as _ from 'lodash';
import { useCallback } from 'react';
import sleep from '../helpers/sleep';

const timestamps = [
  0, 154, 358, 505, 691, 864, 991, 1094, 1271, 1457, 1656, 1841, 2097, 2243,
  2407, 2591,
];

const audioSource = require('../audio/workout_song.mp3');

export const usePlayWorkoutSong = () => {
  const player = useAudioPlayer(audioSource);

  const play = useCallback(async () => {
    const randomTimestamp = _.shuffle(timestamps)[0];
    player.loop = true;
    player.seekTo(randomTimestamp);
    player.volume = 0;
    player.play();
    for (let i = 0; i < 1; i += 0.1) {
      await sleep(200);
      player.volume = i;
    }
  }, [player]);

  const pause = useCallback(() => {
    player.pause();
  }, [player]);

  const resume = useCallback(() => {
    player.play();
  }, []);

  return { play, pause, resume };
};
