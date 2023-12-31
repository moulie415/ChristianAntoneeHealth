import React, {useCallback, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import colors from '../../../../constants/colors';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const RecordingIcon: React.FC<{animate: boolean}> = ({
  animate: shouldAnimate,
}) => {
  const fadeInOpacity = useSharedValue(1);

  const animate = useCallback(() => {
    fadeInOpacity.value = withRepeat(
      withSequence(
        withTiming(0, {duration: 500, easing: Easing.ease}),
        withTiming(1, {duration: 500, easing: Easing.ease}),
      ),
      -1,
    );
  }, [fadeInOpacity]);

  useEffect(() => {
    if (shouldAnimate) {
      animate();
    }
  }, [animate, shouldAnimate]);

  const style = useAnimatedStyle(() => {
    return {
      paddingHorizontal: 10,
      opacity: fadeInOpacity.value,
    };
  });
  return (
    <AnimatedIcon
      name="microphone"
      style={style}
      color={colors.appRed}
      size={25}
    />
  );
};

export default RecordingIcon;
