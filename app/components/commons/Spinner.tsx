import React from 'react';
import {ViewStyle} from 'react-native';
import SpinKit from 'react-native-spinkit';
import colors from '../../constants/colors';

const Spinner: React.FC<{
  color?: string;
  size?: number;
  visible?: boolean;
  style?: ViewStyle;
}> = ({color = colors.appWhite, size = 35, visible = true, style}) => {
  return (
    <SpinKit
      color={color}
      size={size}
      isVisible={visible}
      style={style}
      type="ChasingDots"
    />
  );
};

export default Spinner;
