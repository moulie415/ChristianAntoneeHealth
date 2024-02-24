import React from 'react';
import {TouchableOpacity, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import colors from '../../constants/colors';

const Checkbox: React.FC<{
  checked: boolean;
  onPress: () => void;
  containerStyle?: ViewStyle;
  iconStyle?: any;
}> = ({checked, onPress, containerStyle, iconStyle}) => {
  return (
    <TouchableOpacity onPress={onPress} style={containerStyle}>
      <Icon
        style={[{color: colors.appBlue, fontSize: 20}, iconStyle]}
        name={checked ? 'check-square' : 'square'}
        solid={checked}
      />
    </TouchableOpacity>
  );
};

export default Checkbox;
