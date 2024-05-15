import React, {useRef} from 'react';
import {Animated} from 'react-native';
import FastImage, {FastImageProps} from 'react-native-fast-image';

interface Props extends FastImageProps {
  delay?: number;
  duration?: number;
}

const FastImageAnimated: React.FC<Props> = props => {
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
    <Animated.View style={{opacity: imageScaleValue.current}}>
      <FastImage onLoadEnd={onImageLoadEnd} {...props} />
    </Animated.View>
  );
};

export default FastImageAnimated;
