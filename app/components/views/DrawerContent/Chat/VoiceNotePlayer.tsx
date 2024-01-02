import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {IMessage} from 'react-native-gifted-chat';
import mmss from '../../../../helpers/mmss';
import {Slider} from '@miblanchard/react-native-slider';
import colors from '../../../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Sound from 'react-native-sound';

const VoiceNotePlayer: React.FC<{message: IMessage}> = ({message}) => {
  const [playing, setPlaying] = useState(false);
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);
  const voiceNote = useRef(
    new Sound(message.audio, null, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
    }),
  );

  console.log(message.audio);

  const onPlay = async () => {
    voiceNote.current?.play(success => {
      console.log(success);
    });
    setPlaying(true);
  };

  const onPause = async () => {
    voiceNote.current?.pause();
    setPlaying(false);
  };

  useEffect(() => {}, []);
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
          {mmss(currentPositionSec / 1000)}
        </Text>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
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
            <Icon
              name={playing ? 'pause' : 'play'}
              size={25}
              color={colors.appBlue}
            />
          </TouchableOpacity>
          <Slider
            value={currentPositionSec / currentDurationSec}
            trackStyle={{width: 150}}
            onSlidingComplete={val => {
              voiceNote.current?.setCurrentTime(currentDurationSec * val[0]);
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
