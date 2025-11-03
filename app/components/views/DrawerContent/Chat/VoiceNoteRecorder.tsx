import { Slider } from '@miblanchard/react-native-slider';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import React, { useEffect, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
// @TODO replace with expo audio
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import colors from '../../../../constants/colors';
import mmss from '../../../../helpers/mmss';
import Text from '../../../commons/Text';
import RecordingIcon from './RecordingIcon';
import RecordingIndicator from './RecordingIndicator';

interface Props {
  onClose: () => void;
  onSend: (result: string) => void;
}

const VoiceNoteRecorder = ({ onClose, onSend }: Props) => {
  const audioRecorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });
  const recorderState = useAudioRecorderState(audioRecorder);

  const [stopped, setStopped] = useState(false);

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await audioRecorder.stop();

    setStopped(true);
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied');
      }

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    })();
  }, [audioRecorder]);

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.appWhite,
        marginHorizontal: 20,
        borderRadius: 30,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {!!recorderState.url && stopped ? (
          <TouchableOpacity onPress={() => onClose()}>
            <FontAwesome6
              iconStyle="solid"
              name="trash"
              style={{ padding: 10 }}
              size={20}
              color={colors.appRed}
            />
          </TouchableOpacity>
        ) : (
          <RecordingIcon animate={recorderState.durationMillis > 0} />
        )}
        {!stopped && (
          <Text style={{ width: 40 }}>
            {mmss(Math.floor(audioRecorder.currentTime))}
          </Text>
        )}
        {!stopped && <RecordingIndicator metering={recorderState.metering} />}
        {!!recorderState.url && stopped && <Player uri={recorderState.url} />}
        {!stopped && (
          <TouchableOpacity
            style={{ alignSelf: 'flex-end', padding: 10 }}
            onPress={stopRecording}
          >
            <FontAwesome6 name="circle-stop" size={25} color={colors.appRed} />
          </TouchableOpacity>
        )}
        {!!recorderState.url && stopped && (
          <TouchableOpacity
            onPress={() => {
              onSend(recorderState.url || '');
              onClose();
            }}
          >
            <Text
              style={{
                color: colors.appBlue,
                padding: 10,
                fontWeight: 'bold',
                fontSize: 17,
              }}
            >
              Send
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const Player = ({ uri }: { uri: string }) => {
  const player = useAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);
  return (
    <>
      <Text style={{ width: 40 }}>{mmss(Math.floor(status.currentTime))}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
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
          <FontAwesome6
            iconStyle="solid"
            name={status.playing ? 'pause' : 'play'}
            size={25}
            color={colors.appBlue}
          />
        </TouchableOpacity>
        <Slider
          value={status.isLoaded ? status.currentTime / status.duration : 0}
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
    </>
  );
};

export default VoiceNoteRecorder;
