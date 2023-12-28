import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import Video, {OnProgressData} from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {getVideoHeight} from '../../helpers';

import colors from '../../constants/colors';
import moment from 'moment';
import convertToProxyURL from 'react-native-video-cache';

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
  const ref = useRef<Video>(null);
  const showControls = paused || moment().unix() < hideTime + 3;

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
            if (!hasPressedPlay && setHasPressedPlay) {
              setHasPressedPlay(true);
            }
          }}
          style={{
            height: 50,
            width: 50,
            borderRadius: 25,
            borderWidth: 2,
            borderColor: colors.appWhite,
            position: 'absolute',
            top: fullscreen ? Dimensions.get('window').height / 2 - 25 : '18%',
            left: Dimensions.get('window').width / 2 - 25,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            name={paused ? 'play' : 'pause'}
            color={colors.appWhite}
            size={20}
            style={{marginRight: paused ? -3 : 0}}
          />
        </TouchableOpacity>
      )}
      {/* {(showControls || fullscreen) && (
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
              top: fullscreen ? undefined : getVideoHeight() - 85,
              bottom: fullscreen ? '5%' : undefined,
              right: 20,
            }}>
            <Icon
              name={fullscreen ? 'compress' : 'expand'}
              color={colors.appWhite}
              size={30}
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
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: colors.appBlue,
                    }}
                    hitSlop={{
                      top: 10,
                      bottom: 10,
                      left: 10,
                      right: 10,
                    }}
                  />
                )}
                onValueChange={value => {
                  // @ts-ignore
                  const val = value as number;
                  if (progressData) {
                    const seekable =
                      progressData.seekableDuration /
                      progressData.playableDuration;
                    if (val <= seekable) {
                      ref.current?.seek(progressData.playableDuration * val);
                    }
                  }
                }}
              />
            </View>
          )}
        </>
      )} */}
    </View>
  );
};

export default ExerciseVideo;
