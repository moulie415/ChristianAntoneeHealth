import React, { useRef } from 'react';
import { View } from 'react-native';
import Video, { ResizeMode, VideoRef } from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';
import colors from '../../constants/colors';
import { getVideoHeight } from '../../helpers';

const ExerciseVideo: React.FC<{
  path: string;
  paused: boolean;
  setPaused: (paused: boolean) => void;
  videoIndex?: number;
  currentIndex?: number;
  fullscreen?: boolean;
  setFullScreen: (fullscreen: boolean) => void;
}> = ({
  path,
  paused,
  setPaused,
  videoIndex,
  currentIndex,
  fullscreen,
  setFullScreen,
}) => {
  // const [hideTime, setHideTime] = useState(moment().unix());
  const ref = useRef<VideoRef>(null);
  // const showControls = paused || moment().unix() < hideTime + 3;

  return (
    <View
      style={{
        backgroundColor: colors.appGrey,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* <StatusBar hidden={fullscreen} /> */}
      <Video
        source={{
          uri: convertToProxyURL(path),
          bufferConfig: {
            minBufferMs: 2500,
            maxBufferMs: 5000, // default is 50 000, 50 seconds
            bufferForPlaybackMs: 2500,
            bufferForPlaybackAfterRebufferMs: 2500,
          },
        }}
        style={{
          height: fullscreen ? '100%' : getVideoHeight(),
          width: '100%',
        }}
        resizeMode={ResizeMode.NONE}
        ref={ref}
        onError={e => console.error(e)}
        repeat
        // onEnd={() => {
        //   ref.current?.seek(0);
        // }}
        paused={paused || currentIndex !== videoIndex}
        // onTouchStart={() => setHideTime(moment().unix())}
        disableFocus
      />

      {/* {showControls && (
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
      )} */}
    </View>
  );
};

export default ExerciseVideo;
