import React from 'react';
import {Platform} from 'react-native';
// @ts-ignore
import VideoPlayer from 'react-native-video-controls';
import Video from 'react-native-video';
import {Alert} from 'react-native';

const ExerciseVideo: React.FC<{path: string}> = ({path}) => {
  return (
    <>
      {Platform.OS === 'ios' ? (
        <Video
          source={{uri: path}}
          controls
          onError={e => Alert.alert('error', JSON.stringify(e))}
          style={{height: 250, marginBottom: 10}}
          repeat
        />
      ) : (
        <VideoPlayer
          source={{uri: `file://${path}`}}
          style={{height: 250, marginBottom: 10}}
          disableVolume
          disableBack
          repeat
        />
      )}
    </>
  );
};

export default ExerciseVideo;
