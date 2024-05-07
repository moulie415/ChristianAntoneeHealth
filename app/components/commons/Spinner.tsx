import React from 'react';
import {ViewStyle} from 'react-native';
import colors from '../../constants/colors';
import Loader from './Loader';

const Spinner: React.FC<{
  color?: string;
  size?: number;
  visible?: boolean;
  style?: ViewStyle;
}> = ({color = colors.appWhite, size = 35, visible = true, style}) => {
  if (!visible) {
    return null;
  }
  return <Loader />;
};

export default Spinner;
