import { Slider } from '@miblanchard/react-native-slider';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import type { ReactElement } from 'react';
import React, { Component, useEffect } from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
// @TODO replace with expo audio
// import type {
//   AudioSet,
//   PlayBackType,
//   RecordBackType,
// } from 'react-native-nitro-sound'
// import AudioRecorderPlayer, {
//   AVEncoderAudioQualityIOSType,
//   AudioEncoderAndroidType,
//   AudioSourceAndroidType,
//   OutputFormatAndroidType,
// } from 'react-native-nitro-sound';
import Snackbar from 'react-native-snackbar';
import uuid from 'react-native-uuid';
import colors from '../../../../constants/colors';
import { logError } from '../../../../helpers/error';
import mmss from '../../../../helpers/mmss';
import Text from '../../../commons/Text';
import RecordingIcon from './RecordingIcon';
import RecordingIndicator from './RecordingIndicator';
import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioPlayer, useAudioRecorder, useAudioRecorderState } from 'expo-audio';

interface State {
  recordSecs: number;
  currentPositionSec: number;
  currentDurationSec: number;
  result?: string;
  metering?: number;
  playing: boolean;
}

interface Props {
  onClose: () => void;
  onSend: (result: string) => void;
}

const VoiceNoteRecorder = ({ onClose, onSend }: Props) => {
  const audioRecorder = useAudioRecorder({ ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true});
  const recorderState = useAudioRecorderState(audioRecorder);

  const player = useAudioPlayer({uri: audioRecorder.uri || undefined});

  console.log(recorderState.url)
  console.log(audioRecorder.uri)

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await audioRecorder.stop();
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied');
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record(); 
    })();
  }, []);

  console.log(!!recorderState.url && !recorderState.isRecording && player.isLoaded)
  return <View
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
          {!!recorderState.url && !recorderState.isRecording ? (
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
          <Text>
            {mmss(
              Math.floor(
                recorderState.isRecording
                  ? audioRecorder.currentTime
                  : recorderState.durationMillis / 1000,
              ),
            )}
          </Text>
          {recorderState.isRecording && (
            <RecordingIndicator metering={recorderState.metering} />
          )}
          {!!recorderState.url && !recorderState.isRecording && player.isLoaded && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  padding: 10,
                  width: 40,
                  alignItems: 'center',
                }}
                onPress={() => {
                  if (player.playing) {
                    player.pause()
                  } else {
                    player.play()
                  }
                }}
              >
                <FontAwesome6
                  iconStyle="solid"
                  name={player.playing ? 'pause' : 'play'}
                  size={25}
                  color={colors.appBlue}
                />
              </TouchableOpacity>
              <Slider
                value={
                  player.currentTime / player.duration
                }
                trackStyle={{ width: 150 }}
                onSlidingComplete={val => {
                  if (player.isLoaded) {
                    player.seekTo(player.duration * val[0])
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
          )}
        {recorderState.isRecording && (
          <TouchableOpacity
            style={{ alignSelf: 'flex-end', padding: 10 }}
            onPress={stopRecording}
          >
            <FontAwesome6 name="circle-stop" size={25} color={colors.appRed} />
          </TouchableOpacity>
        )}
        {!!recorderState.url && !recorderState.isRecording &&  (
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
  return null;
  console.log('test 1')
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundcolor: colors.appwhite,
          marginhorizontal: 20,
          borderradius: 30,
          height: 45,
          flexdirection: 'row',
          alignitems: 'center',
          justifycontent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {!!recorderState.url && !recorderState.isRecording ? (
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
          <Text>
            {mmss(
              Math.floor(
                recorderState.isRecording
                  ? audioRecorder.currentTime
                  : recorderState.durationMillis / 1000,
              ),
            )}
          </Text>
          {!recorderState.isRecording && (
            <RecordingIndicator metering={recorderState.metering} />
          )}
          {!!recorderState.url && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  padding: 10,
                  width: 40,
                  alignItems: 'center',
                }}
                onPress={() => {
                  if (player.playing) {
                    player.pause()
                  } else {
                    player.play()
                  }
                }}
              >
                <FontAwesome6
                  iconStyle="solid"
                  name={player.playing ? 'pause' : 'play'}
                  size={25}
                  color={colors.appBlue}
                />
              </TouchableOpacity>
              <Slider
                value={
                  player.currentTime / player.duration
                }
                trackStyle={{ width: 150 }}
                onSlidingComplete={val => {
                  if (player.isLoaded) {
                    player.seekTo(player.duration * val[0])
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
          )}
        </View>
        {!recorderState.url && (
          <TouchableOpacity
            style={{ alignSelf: 'flex-end', padding: 10 }}
            onPress={stopRecording}
          >
            <FontAwesome6 name="circle-stop" size={25} color={colors.appRed} />
          </TouchableOpacity>
        )}
        {recorderState.url && (
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
    );
  }


export default VoiceNoteRecorder;
