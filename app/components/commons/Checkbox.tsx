import React from 'react';
import {TouchableOpacity, ViewStyle} from 'react-native';
import {FontAwesome6} from '@react-native-vector-icons/fontawesome6';
import colors from '../../constants/colors';

const Checkbox: React.FC<{
  checked: boolean;
  onPress: () => void;
  containerStyle?: ViewStyle;
  iconStyle?: any;
}> = ({checked, onPress, containerStyle, iconStyle}) => {
  return (
    <TouchableOpacity onPress={onPress} style={containerStyle}>
      {/* <FontAwesome6
        style={[{color: colors.appBlue, fontSize: 20}, iconStyle]}
        name={checked ? 'check-square' : 'square'}
        solid={checked}
      /> */}
    </TouchableOpacity>
  );
};

export default Checkbox;
