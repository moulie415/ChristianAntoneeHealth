import {View, Text, TouchableOpacity, Dimensions, Platform} from 'react-native';
import React, {MutableRefObject, useState} from 'react';
import Exercise from '../../types/Exercise';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PagerView from 'react-native-pager-view';

import {
  OrientationType,
  useOrientationChange,
} from 'react-native-orientation-locker';
import {hasNotch} from 'react-native-device-info';

const ExerciseArrows: React.FC<{
  exercises: Exercise[];
  pagerRef: MutableRefObject<PagerView | null>;
  fullscreen: boolean;
  index: number;
}> = ({exercises, pagerRef, fullscreen, index}) => {
  const [orientation, setOrientation] = useState<OrientationType>();
  const top = fullscreen ? Dimensions.get('window').height / 2 - 15 : '18%';
  useOrientationChange(o => {
    setOrientation(o);
  });

  const right =
    Platform.OS === 'ios' &&
    orientation === OrientationType['LANDSCAPE-RIGHT'] &&
    hasNotch()
      ? 30
      : 5;

  const left =
    Platform.OS === 'ios' &&
    orientation === OrientationType['LANDSCAPE-LEFT'] &&
    hasNotch()
      ? 30
      : 5;

  return (
    <>
      {exercises[index + 1] && (
        <TouchableOpacity
          onPress={() => pagerRef.current?.setPage(index + 1)}
          style={{
            position: 'absolute',
            right,
            top,
            zIndex: 9,
            padding: 10,
          }}>
          <Icon name="chevron-right" size={30} color="#fff" />
        </TouchableOpacity>
      )}
      {exercises[index - 1] && (
        <TouchableOpacity
          onPress={() => pagerRef.current?.setPage(index - 1)}
          style={{
            position: 'absolute',
            left,
            top,
            zIndex: 9,
            padding: 10,
          }}>
          <Icon name="chevron-left" size={30} color="#fff" />
        </TouchableOpacity>
      )}
    </>
  );
};

export default ExerciseArrows;
