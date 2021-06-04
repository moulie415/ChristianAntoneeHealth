import React, {FunctionComponent, useRef} from 'react';
import {Animated} from 'react-native';
import ImageLoaderProps from '../../types/commons/ImageLoader';

const ImageLoader: FunctionComponent<ImageLoaderProps> = props => {
  const opacity = useRef(new Animated.Value(0));

  const onLoad = () => {
    Animated.timing(opacity.current, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      delay: props.delay,
    }).start();
  };

  return (
    <Animated.Image
      onLoad={onLoad}
      {...props}
      style={[
        {
          opacity: opacity.current,
          transform: [
            {
              scale: opacity.current.interpolate({
                inputRange: [0, 1],
                outputRange: [0.85, 1],
              }),
            },
          ],
        },
        props.style,
      ]}
    />
  );
};

export default ImageLoader;
