import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import Video, {OnProgressData} from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {getVideoHeight} from '../../helpers';
import DevicePixels from '../../helpers/DevicePixels';
import {logError} from '../../helpers/error';
import colors from '../../constants/colors';
import moment from 'moment';
import convertToProxyURL from 'react-native-video-cache';
import {Slider} from '@miblanchard/react-native-slider';
import LinearGradient from 'react-native-linear-gradient';

const ExerciseVideo: React.FC<{
  path: string;
  paused?: boolean;
  videoIndex?: number;
  currentIndex?: number;
  hasPressedPlay?: boolean;
  setHasPressedPlay?: (pressed: boolean) => void;
  fullscreen?: boolean;
  setFullScreen: (fullscreen: boolean) => void;
}> = ({
  path,
  paused: startedPaused,
  videoIndex,
  currentIndex,
  hasPressedPlay,
  setHasPressedPlay,
  fullscreen,
  setFullScreen,
}) => {
  const [paused, setPaused] = useState(startedPaused);
  const [hideTime, setHideTime] = useState(moment().unix());
  const ref = useRef<Video>();
  const showControls = paused || moment().unix() < hideTime + 3;
  const [progressData, setProgressData] = useState<OnProgressData>();

  useEffect(() => {
    if (hasPressedPlay && currentIndex === videoIndex) {
      setPaused(false);
    } else if (currentIndex !== videoIndex) {
      setPaused(true);
    }
  }, [currentIndex, videoIndex, hasPressedPlay]);

  return (
    <View
      style={{
        backgroundColor: colors.appGrey,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}>
      <StatusBar hidden={fullscreen} />
      <Video
        source={{uri: convertToProxyURL(path)}}
        style={{height: fullscreen ? '100%' : getVideoHeight(), width: '100%'}}
        resizeMode={'none'}
        ref={ref}
        onError={e => console.error(e)}
        onProgress={setProgressData}
        repeat
        // onEnd={() => {
        //   ref.current?.seek(0);
        // }}
        paused={paused}
        onTouchStart={() => setHideTime(moment().unix())}
        disableFocus
      />

      {showControls && (
        <TouchableOpacity
          onPress={() => {
            setHideTime(paused ? moment().unix() - 3 : moment().unix());
            setPaused(!paused);
            if (!hasPressedPlay) {
              setHasPressedPlay(true);
            }
          }}
          style={{
            height: DevicePixels[50],
            width: DevicePixels[50],
            borderRadius: DevicePixels[25],
            backgroundColor: colors.appWhite,
            position: 'absolute',
            top: fullscreen
              ? Dimensions.get('window').height / 2 - DevicePixels[25]
              : '18%',
            left: Dimensions.get('window').width / 2 - DevicePixels[25],
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            name={paused ? 'play' : 'pause'}
            color={colors.appBlue}
            size={DevicePixels[20]}
            style={{marginRight: paused ? -DevicePixels[3] : 0}}
          />
        </TouchableOpacity>
      )}
      {(showControls || fullscreen) && (
        <>
          <TouchableOpacity
            onPress={() => {
              if (fullscreen) {
                setFullScreen(false);
              } else {
                setFullScreen(true);
              }
            }}
            style={{
              position: 'absolute',
              top: fullscreen ? undefined : '37%',
              bottom: fullscreen ? '5%' : undefined,
              right: DevicePixels[20],
            }}>
            <Icon
              name={fullscreen ? 'compress' : 'expand'}
              color={colors.appWhite}
              size={DevicePixels[30]}
            />
          </TouchableOpacity>
          {fullscreen && (
            <View
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                flex: 1,
                width: '77%',
                position: 'absolute',
                bottom: '4.5%',
                left: '5%',
                right: 0,
              }}>
              <Slider
                value={
                  progressData
                    ? progressData.currentTime / progressData.playableDuration
                    : 0
                }
                maximumTrackTintColor={colors.appWhite}
                minimumTrackTintColor={colors.appBlue}
                thumbTintColor={colors.appBlue}
                renderThumbComponent={() => (
                  <LinearGradient
                    style={{
                      width: DevicePixels[30],
                      height: DevicePixels[30],
                      borderRadius: DevicePixels[15],
                      backgroundColor: colors.appBlue,
                    }}
                    colors={[colors.appBlueLight, colors.appBlueDark]}
                    hitSlop={{
                      top: DevicePixels[10],
                      bottom: DevicePixels[10],
                      left: DevicePixels[10],
                      right: DevicePixels[10],
                    }}
                  />
                )}
                onValueChange={value => {
                  const val = value as number;
                  const seekable =
                    progressData.seekableDuration /
                    progressData.playableDuration;
                  if (val <= seekable) {
                    ref.current?.seek(progressData.playableDuration * val);
                  }
                }}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default ExerciseVideo;
