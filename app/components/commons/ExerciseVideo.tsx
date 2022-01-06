import React from 'react';
import {Platform} from 'react-native';
import Video from 'react-native-video';
import {getVideoHeight} from '../../helpers';
import crashlytics from '@react-native-firebase/crashlytics';
import DevicePixels from '../../helpers/DevicePixels';

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
          onError={e => crashlytics().log(e.error.errorString)}
          style={{height: getVideoHeight(), marginBottom: DevicePixels[10]}}
          repeat
          paused={paused}
        />
      ) : (
        <Video
          source={{uri: `file://${path}`}}
          style={{height: getVideoHeight(), marginBottom: DevicePixels[10]}}
          onError={e => crashlytics().log(e.error.errorString)}
          repeat
          paused={paused}
          controls
        />
      )}
    </>
  );
};

export default ExerciseVideo;
