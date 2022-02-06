import {TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import DevicePixels from '../../helpers/DevicePixels';

const Checkbox: React.FC<{
  checked: boolean;
  onPress: () => void;
  containerStyle?: ViewStyle;
  iconStyle?: any;
}> = ({checked, onPress, containerStyle, iconStyle}) => {
  return (
    <TouchableOpacity onPress={onPress} style={containerStyle}>
      <Icon
        style={[{color: colors.appBlue, fontSize: DevicePixels[20]}, iconStyle]}
        name={checked ? 'check-square' : 'square'}
        solid={checked}
      />
    </TouchableOpacity>
  );
};

export default Checkbox;
