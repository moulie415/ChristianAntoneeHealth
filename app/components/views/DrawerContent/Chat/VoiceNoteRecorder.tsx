import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import type {
  AudioSet,
  PlayBackType,
  RecordBackType,
} from 'react-native-audio-recorder-player';
import {
  Dimensions,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Component} from 'react';
import type {ReactElement} from 'react';
import colors from '../../../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Text from '../../../commons/Text';
import Spinner from 'react-native-spinkit';
import RecordingIcon from './RecordingIcon';
import RecordingIndicator from './RecordingIndicator';
import RNFS from 'react-native-fs';
import uuid from 'react-native-uuid';
import {Slider} from '@miblanchard/react-native-slider';

function pad(num: number) {
  return ('0' + num).slice(-2);
}
function mmss(secs: number) {
  var minutes = Math.floor(secs / 60);
  secs = secs % 60;
  return `${pad(minutes)}:${pad(secs)}`;
}

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

class VoiceNoteRecorder extends Component<Props, State> {
  private path = Platform.select({
    // Discussion: https://github.com/hyochan/react-native-audio-recorder-player/discussions/479
    // ios: 'https://firebasestorage.googleapis.com/v0/b/cooni-ebee8.appspot.com/o/test-audio.mp3?alt=media&token=d05a2150-2e52-4a2e-9c8c-d906450be20b',
    // ios: 'https://staging.media.ensembl.fr/original/uploads/26403543-c7d0-4d44-82c2-eb8364c614d0',
    ios: `${uuid.v4()}.m4a`,
    android: `${RNFS.CachesDirectoryPath}/${uuid.v4()}.mp3`,
  });

  private audioRecorderPlayer: AudioRecorderPlayer;

  private stopped = false;
  private sending = false;

  constructor(props: any) {
    super(props);
    this.state = {
      recordSecs: 0,
      currentPositionSec: 0,
      currentDurationSec: 0,
      playing: false,
    };

    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.1); // optional. Default is 0.5
  }

  componentDidMount(): void {
    this.onStartRecord();
  }

  public render(): ReactElement {
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
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {this.state.result ? (
            <TouchableOpacity onPress={() => this.props.onClose()}>
              <Icon
                name="trash"
                style={{padding: 10}}
                size={20}
                color={colors.appRed}
              />
            </TouchableOpacity>
          ) : (
            <RecordingIcon animate={this.state.recordSecs > 0} />
          )}
          <Text>
            {mmss(
              Math.floor(
                this.state.result
                  ? this.state.currentPositionSec / 1000
                  : this.state.recordSecs,
              ),
            )}
          </Text>
          {!this.state.result && (
            <RecordingIndicator metering={this.state.metering} />
          )}
          {this.state.result && (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  padding: 10,
                  width: 40,
                  alignItems: 'center',
                }}
                onPress={() => {
                  if (this.state.playing) {
                    this.onPausePlay();
                  } else {
                    if (
                      this.state.currentPositionSec > 0 &&
                      this.state.currentPositionSec <
                        this.state.currentDurationSec
                    ) {
                      this.onResumePlay();
                    } else {
                      this.onStartPlay();
                    }
                  }
                }}>
                <Icon
                  name={this.state.playing ? 'pause' : 'play'}
                  size={25}
                  color={colors.appBlue}
                />
              </TouchableOpacity>
              <Slider
                value={
                  this.state.currentPositionSec / this.state.currentDurationSec
                }
                trackStyle={{width: 150}}
                onSlidingComplete={val => {
                  this.audioRecorderPlayer.seekToPlayer(
                    this.state.currentDurationSec * val[0],
                  );
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
          )}
        </View>
        {!this.state.result && (
          <TouchableOpacity
            style={{alignSelf: 'flex-end', padding: 10}}
            onPress={() => this.onStopRecord()}>
            <Icon name="circle-stop" size={25} color={colors.appRed} />
          </TouchableOpacity>
        )}
        {this.state.result && (
          <TouchableOpacity
            onPress={() => {
              if (this.sending) {
                return false;
              }
              this.sending = true;
              this.props.onSend(this.state.result || '');
              this.props.onClose();
            }}>
            <Text
              style={{
                color: colors.appBlue,
                padding: 10,
                fontWeight: 'bold',
                fontSize: 17,
              }}>
              Send
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  private onStartRecord = async (): Promise<void> => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        console.log('write external stroage', grants);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('permissions granted');
        } else {
          console.log('All required permissions not granted');

          return;
        }
      } catch (err) {
        console.warn(err);

        return;
      }
    }

    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
      OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
    };

    const uri = await this.audioRecorderPlayer.startRecorder(
      this.path,
      audioSet,
      true,
    );

    this.audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
      // console.log('record-back', e);
      this.setState({
        recordSecs: e.currentPosition / 1000,
        metering: e.currentMetering,
      });
    });
  };

  private onStopRecord = async (): Promise<void> => {
    if (this.stopped) {
      return;
    }
    this.stopped = true;
    const result = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
      result,
    });
  };

  private onStartPlay = async (): Promise<void> => {
    try {
      const msg = await this.audioRecorderPlayer.startPlayer(this.path);

      //? Default path
      // const msg = await this.audioRecorderPlayer.startPlayer();
      const volume = await this.audioRecorderPlayer.setVolume(1.0);

      this.audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
        this.setState({
          currentPositionSec: e.currentPosition,
          currentDurationSec: e.duration,
        });
        if (e.currentPosition === e.duration) {
          this.setState({playing: false});
        }
      });
      this.setState({playing: true});
    } catch (err) {
      console.log('startPlayer error', err);
    }
  };

  private onPausePlay = async (): Promise<void> => {
    await this.audioRecorderPlayer.pausePlayer();
    this.setState({playing: false});
  };

  private onResumePlay = async (): Promise<void> => {
    await this.audioRecorderPlayer.resumePlayer();
    this.setState({playing: true});
  };

  private onStopPlay = async (): Promise<void> => {
    console.log('onStopPlay');
    this.audioRecorderPlayer.stopPlayer();
    this.audioRecorderPlayer.removePlayBackListener();
  };
}

export default VoiceNoteRecorder;
