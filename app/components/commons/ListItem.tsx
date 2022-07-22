import {TouchableOpacity, View, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
import Text from './Text';
import DevicePixels from '../../helpers/DevicePixels';
import colors from '../../constants/colors';

const ListItem: React.FC<{
  onPress?: () => void;
  onLongPress?: () => void;
  accessoryLeft?: ReactNode;
  accessoryRight?: ReactNode;
  title?: string;
  description?: string;
  disabled?: boolean;
  style?: ViewStyle;
}> = ({
  onPress,
  accessoryLeft,
  title,
  description,
  accessoryRight,
  disabled,
  style,
  onLongPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          padding: DevicePixels[5],
        },
        style,
      ]}>
      {!!accessoryLeft && accessoryLeft}
      <View style={{justifyContent: 'center', padding: DevicePixels[5]}}>
        <Text style={{}}>{title}</Text>
        {!!description && (
          <Text style={{color: colors.textGrey}}>{description}</Text>
        )}
      </View>
      {!!accessoryRight && (
        <View
          style={{alignItems: 'flex-end', flex: 1, padding: DevicePixels[5]}}>
          {accessoryRight}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ListItem;
