import {View, Text, TouchableOpacity, Dimensions, Platform} from 'react-native';
import React, {MutableRefObject, useState} from 'react';
import Exercise from '../../types/Exercise';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PagerView from 'react-native-pager-view';
import DevicePixels from '../../helpers/DevicePixels';
import {
  OrientationType,
  useOrientationChange,
} from 'react-native-orientation-locker';
import {hasNotch} from 'react-native-device-info';

const ExerciseArrows: React.FC<{
  exercises: Exercise[];
  pagerRef: MutableRefObject<PagerView>;
  fullscreen: boolean;
  index: number;
}> = ({exercises, pagerRef, fullscreen, index}) => {
  const [orientation, setOrientation] = useState<OrientationType>();
  const top = fullscreen
    ? Dimensions.get('window').height / 2 - DevicePixels[15]
    : '18%';
  useOrientationChange(o => {
    setOrientation(o);
  });

  const right =
    Platform.OS === 'ios' &&
    orientation === OrientationType['LANDSCAPE-RIGHT'] &&
    hasNotch()
      ? DevicePixels[30]
      : DevicePixels[5];

  const left =
    Platform.OS === 'ios' &&
    orientation === OrientationType['LANDSCAPE-LEFT'] &&
    hasNotch()
      ? DevicePixels[30]
      : DevicePixels[5];

  return (
    <>
      {exercises[index + 1] && (
        <TouchableOpacity
          onPress={() => pagerRef.current.setPage(index + 1)}
          style={{
            position: 'absolute',
            right,
            top,
            zIndex: 9,
            padding: DevicePixels[10],
          }}>
          <Icon name="chevron-right" size={DevicePixels[30]} color="#fff" />
        </TouchableOpacity>
      )}
      {exercises[index - 1] && (
        <TouchableOpacity
          onPress={() => pagerRef.current.setPage(index - 1)}
          style={{
            position: 'absolute',
            left,
            top,
            zIndex: 9,
            padding: DevicePixels[10],
          }}>
          <Icon name="chevron-left" size={DevicePixels[30]} color="#fff" />
        </TouchableOpacity>
      )}
    </>
  );
};

export default ExerciseArrows;
