import React from 'react';
import { View } from 'react-native';
import colors from '../../constants/colors';
import Loader from '../commons/Loader';

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
      }}
    >
      <Loader />
    </View>
  );
};

export default Loading;
