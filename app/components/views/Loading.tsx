import React from 'react';
import Spinner from 'react-native-spinkit';
import colors from '../../constants/colors';
import FastImage from 'react-native-fast-image';

const Loading = () => {
  return (
    <FastImage
      style={{
        width: '100%',
        height: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      source={require('../../images/loading.jpg')}>
      <Spinner type="ChasingDots" color={colors.appBlue} />
    </FastImage>
  );
};

export default Loading;
