import {Animated} from 'react-native';
import React, {useRef} from 'react';
import FastImage, {FastImageProps} from 'react-native-fast-image';

const FastImageAnimated: React.FC<FastImageProps> = props => {
  const imageScaleValue = useRef(new Animated.Value(0));

  const onImageLoadEnd = () => {
    Animated.timing(imageScaleValue.current, {
      toValue: 1,
      duration: 500,
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
