import React, {useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import ImageLoaderProps from '../../types/commons/ImageLoader';

const ImageLoader: React.FC<ImageLoaderProps> = props => {
  const opacity = useRef(new Animated.Value(0));
  const overlayOpacity = useRef(new Animated.Value(0));

  const onLoad = () => {
    Animated.timing(opacity.current, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      delay: props.delay,
    }).start();
    Animated.timing(overlayOpacity.current, {
      toValue: 0.6,
      duration: 1000,
      useNativeDriver: true,
      delay: props.delay,
    }).start();
  };

  return (
    <>
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
      {props.overlay && (
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: '#000',
            opacity: overlayOpacity.current,
          }}
        />
      )}
    </>
  );
};

export default ImageLoader;
