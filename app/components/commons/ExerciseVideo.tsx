import React, {useRef} from 'react';
import {Platform} from 'react-native';
import Video from 'react-native-video';
import {getVideoHeight} from '../../helpers';
import DevicePixels from '../../helpers/DevicePixels';
import {logError} from '../../helpers/error';

const ExerciseVideo: React.FC<{
  path: string;
  paused?: boolean;
  onPause?: () => void;
  onPlay?: () => void;
}> = ({path, paused, onPause, onPlay}) => {
  const ref = useRef<Video>();
  return (
    <>
      {Platform.OS === 'ios' ? (
        <Video
          source={{uri: path}}
          controls
          ref={ref}
          onError={e => console.error(e)}
          style={{height: getVideoHeight()}}
          //repeat
          onEnd={() => {
            ref.current?.seek(0);
          }}
          paused={paused}
          disableFocus
        />
      ) : (
        <Video
          source={{uri: `file://${path}`}}
          style={{height: getVideoHeight()}}
          ref={ref}
          onError={e => console.error(e)}
          // repeat
          onEnd={() => {
            ref.current?.seek(0);
          }}
          paused={paused}
          controls
          disableFocus
        />
      )}
    </>
  );
};

export default ExerciseVideo;
