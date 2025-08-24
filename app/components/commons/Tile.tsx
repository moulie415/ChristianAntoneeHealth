import React, {ReactNode} from 'react';
import {TouchableOpacity, ViewStyle} from 'react-native';
import colors from '../../constants/colors';

const Tile: React.FC<{
  onPress?: () => void;
  children?: ReactNode;
  backgroundColor?: string;
  style?: ViewStyle;
}> = ({onPress, children, backgroundColor = colors.tile, style}) => {
  return (
    <TouchableOpacity
      style={[{backgroundColor, borderRadius: 15}, style]}
      onPress={onPress}
      disabled={!onPress}>
      {children}
    </TouchableOpacity>
  );
};

export default Tile;
