import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import React, { useCallback, useEffect } from 'react';

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import colors from '../../../../constants/colors';

const RecordingIcon: React.FC<{ animate: boolean }> = ({
  animate: shouldAnimate,
}) => {
  const fadeInOpacity = useSharedValue(1);

  const animate = useCallback(() => {
    fadeInOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 500, easing: Easing.ease }),
        withTiming(1, { duration: 500, easing: Easing.ease }),
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
    <Animated.View style={style}>
      <FontAwesome6
        name="microphone"
        iconStyle="solid"
        color={colors.appRed}
        size={25}
      />
    </Animated.View>
  );
};

export default RecordingIcon;
