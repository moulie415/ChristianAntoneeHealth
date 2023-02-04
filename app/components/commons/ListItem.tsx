import {TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
import Text from './Text';

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
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
}> = ({
  onPress,
  accessoryLeft,
  title,
  description,
  accessoryRight,
  disabled,
  style,
  onLongPress,
  titleStyle,
  descriptionStyle,
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
          padding: 5,
        },
        style,
      ]}>
      {!!accessoryLeft && accessoryLeft}
      <View style={{justifyContent: 'center', padding: 5}}>
        <Text style={[{color: colors.appWhite}, titleStyle]}>{title}</Text>
        {!!description && (
          <Text style={[{color: colors.textGrey}, descriptionStyle]}>
            {description}
          </Text>
        )}
      </View>
      {!!accessoryRight && (
        <View style={{alignItems: 'flex-end', flex: 1, padding: 5}}>
          {accessoryRight}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ListItem;
