import {Slider} from '@miblanchard/react-native-slider';
import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {IMessage} from 'react-native-gifted-chat';
import SoundPlayer from 'react-native-sound-player';
import Spinner from 'react-native-spinkit';
import Icon from 'react-native-vector-icons/FontAwesome6';
import colors from '../../../../constants/colors';
import mmss from '../../../../helpers/mmss';
import useInterval from '../../../../hooks/UseInterval';

const VoiceNotePlayer: React.FC<{message: IMessage}> = ({message}) => {
  const [playing, setPlaying] = useState<boolean>();
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);

  const audio = message.audio || '';

  const onPlay = async () => {
    if (playing === undefined) {
      SoundPlayer.playUrl(audio);
    } else {
      SoundPlayer.resume();
    }
    setPlaying(true);
  };

  const onPause = async () => {
    SoundPlayer.pause();
    setPlaying(false);
  };

  useEffect(() => {
    const sub = SoundPlayer.addEventListener('FinishedPlaying', () => {
      SoundPlayer.seek(0);
      setPlaying(false);
    });
    return () => {
      sub.remove();
    };
  }, []);

  useInterval(async () => {
    if (playing) {
      const {currentTime, duration} = await SoundPlayer.getInfo();
      setCurrentDurationSec(duration);
      setCurrentPositionSec(currentTime);
    }
  }, 100);
  return (
    <View
      style={{
        position: 'relative',
        width: 250,
        margin: 3,
        backgroundColor: 'white',
        borderRadius: 15,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{width: 40, marginLeft: 10}}>
          {mmss(Math.floor(currentPositionSec))}
        </Text>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            disabled={message.pending}
            style={{
              alignSelf: 'flex-end',
              padding: 10,
              width: 40,
              alignItems: 'center',
            }}
            onPress={() => {
              if (playing) {
                onPause();
              } else {
                onPlay();
              }
            }}>
            {message.pending ? (
              <Spinner type="Circle" size={20} color={colors.appBlue} />
            ) : (
              <Icon
                name={playing ? 'pause' : 'play'}
                size={25}
                color={colors.appBlue}
              />
            )}
          </TouchableOpacity>
          <Slider
            disabled={message.pending}
            value={currentPositionSec / currentDurationSec}
            trackStyle={{width: 150}}
            onSlidingComplete={val => {
              if (playing !== undefined) {
                SoundPlayer.seek(currentDurationSec * val[0]);
              }
            }}
            renderThumbComponent={() => {
              return (
                <View
                  style={{
                    backgroundColor: colors.appWhite,
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      height: 18,
                      width: 18,
                      borderRadius: 9,
                      backgroundColor: colors.appBlue,
                    }}
                  />
                </View>
              );
            }}
            minimumTrackTintColor={colors.appBlueFaded}
            maximumTrackTintColor={colors.appBlue}
          />
        </View>
      </View>
    </View>
  );
};

export default VoiceNotePlayer;
