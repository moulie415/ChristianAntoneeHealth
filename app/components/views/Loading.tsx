import {Layout} from '@ui-kitten/components';
import React from 'react';
import globalStyles from '../../styles/globalStyles';
import Spinner from 'react-native-spinkit';
import colors from '../../constants/colors';
import {ImageBackground} from 'react-native';

const Loading = () => {
  return (
    <ImageBackground
      style={{
        width: '100%',
        height: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      source={require('../../images/loading.jpg')}>
      <Spinner type="ChasingDots" color={colors.appBlue} />
    </ImageBackground>
  );
};

export default Loading;
