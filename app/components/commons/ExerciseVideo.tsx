import React from 'react';
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
  return (
    <>
      {Platform.OS === 'ios' ? (
        <Video
          source={{uri: path}}
          controls
          onError={e => logError(new Error(e.error.errorString))}
          style={{height: getVideoHeight()}}
          repeat
          paused={paused}
        />
      ) : (
        <Video
          source={{uri: `file://${path}`}}
          style={{height: getVideoHeight()}}
          onError={e => logError(new Error(e.error.errorString))}
          repeat
          paused={paused}
          controls
        />
      )}
    </>
  );
};

export default ExerciseVideo;
