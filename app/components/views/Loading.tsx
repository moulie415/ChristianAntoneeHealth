import React from 'react';
import Spinner from 'react-native-spinkit';
import colors from '../../constants/colors';
import {View} from 'react-native';

const Loading = () => {
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.appGrey,
      }}>
      <Spinner type="ChasingDots" color={colors.appWhite} />
    </View>
  );
};

export default Loading;
