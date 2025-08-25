import React, { useRef } from 'react';
import { Animated, ImageBackground, ImageBackgroundProps } from 'react-native';

interface Props extends ImageBackgroundProps {
  delay?: number;
  duration?: number;
}

const ImageAnimated: React.FC<Props> = props => {
  const imageScaleValue = useRef(new Animated.Value(0));

  const onImageLoadEnd = () => {
    Animated.timing(imageScaleValue.current, {
      toValue: 1,
      duration: props.duration || 500,
      delay: props.delay,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ opacity: imageScaleValue.current }}>
      <ImageBackground onLoadEnd={onImageLoadEnd} {...props} />
    </Animated.View>
  );
};

export default ImageAnimated;
