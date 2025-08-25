import LottieView from 'lottie-react-native';
import React from 'react';

const Loader: React.FC<{ size?: number }> = ({ size = 100 }) => {
  return (
    <LottieView
      source={require('../../animations/loading.json')}
      style={{ width: size, height: size }}
      colorFilters={[]}
      autoPlay
      loop
    />
  );
};

export default Loader;
