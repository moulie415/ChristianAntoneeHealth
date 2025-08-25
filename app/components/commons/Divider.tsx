import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import colors from '../../constants/colors';

const Divider: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  return (
    <View
      style={[
        {
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.textGrey,
        },
        style,
      ]}
    />
  );
};

export default Divider;
