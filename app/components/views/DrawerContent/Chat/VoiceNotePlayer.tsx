import { Slider } from '@miblanchard/react-native-slider';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import React from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { IMessage } from 'react-native-gifted-chat';
import colors from '../../../../constants/colors';
import mmss from '../../../../helpers/mmss';
import Text from '../../../commons/Text';

const VoiceNotePlayer: React.FC<{ message: IMessage }> = ({ message }) => {
  const audio = message.audio || '';
  const player = useAudioPlayer(audio);
  const status = useAudioPlayerStatus(player);

  return (
    <View
      style={{
        position: 'relative',
        width: 250,
        margin: 3,
        backgroundColor: 'white',
        borderRadius: 15,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ width: 40, marginLeft: 10 }}>
          {mmss(Math.floor(status.currentTime))}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            disabled={message.pending}
            style={{
              alignSelf: 'flex-end',
              padding: 10,
              width: 40,
              alignItems: 'center',
            }}
            onPress={() => {
              if (status.playing) {
                player.pause();
              } else {
                if (status.currentTime === status.duration) {
                  player.seekTo(0);
                }
                player.play();
              }
            }}
          >
            {message.pending ? (
              <ActivityIndicator size="small" color={colors.appBlue} />
            ) : (
              <FontAwesome6
                iconStyle="solid"
                name={status.playing ? 'pause' : 'play'}
                size={25}
                color={colors.appBlue}
              />
            )}
          </TouchableOpacity>
          <Slider
            disabled={message.pending}
            value={status.currentTime / status.duration}
            trackStyle={{ width: 150 }}
            onSlidingComplete={val => {
              if (status.isLoaded) {
                player.seekTo(status.duration * val[0]);
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
                  }}
                >
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
