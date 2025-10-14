import * as _ from 'lodash';
import sleep from './sleep';
import SoundPlayer from 'react-native-sound-player';

const playWorkoutSong = async () => {
  const timestamps = [
    0, 154, 358, 505, 691, 864, 991, 1094, 1271, 1457, 1656, 1841, 2097, 2243,
    2407, 2591,
  ];

  const randomTimestamp = _.shuffle(timestamps)[0];

  SoundPlayer.seek(randomTimestamp);
  SoundPlayer.setVolume(0);
  SoundPlayer.play();

  for (let i = 0; i < 1; i += 0.1) {
    await sleep(200);
    SoundPlayer.setVolume(i)
  }
};

export default playWorkoutSong;
