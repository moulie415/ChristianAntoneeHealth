import {View, StyleSheet, ViewStyle} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';

const Divider: React.FC<{style?: ViewStyle}> = ({style}) => {
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
