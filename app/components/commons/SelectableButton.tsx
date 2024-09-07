import React, {ReactNode} from 'react';
import {Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import colors from '../../constants/colors';

const SelectableButton: React.FC<{
  selected: boolean;
  onPress: () => void;
  text: string | ReactNode;
  secondaryText?: string | ReactNode;
  style?: ViewStyle;
  customRight?: ReactNode;
}> = ({selected, onPress, text, secondaryText, style, customRight}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          borderWidth: selected ? 2 : 1,
          borderColor: selected ? colors.appBlue : colors.borderColor,
          borderRadius: 12,
          padding: 15,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
        },
        style,
      ]}>
      <View style={{flex: 1}}>
        {typeof text === 'string' ? (
          <Text
            style={{
              color: colors.appWhite,
              fontSize: 14,
              fontWeight: 'bold',
            }}>
            {text}
          </Text>
        ) : (
          text
        )}
        {!!secondaryText && typeof secondaryText === 'string' && (
          <Text
            style={{
              color: colors.offWhite,
              marginTop: 10,
              fontSize: 12,
            }}>
            {secondaryText}
          </Text>
        )}

        {!!secondaryText && typeof secondaryText !== 'string' && secondaryText}
      </View>
      {customRight
        ? customRight
        : selected && (
            <View style={{width: 30, alignItems: 'center'}}>
              <Icon size={20} color={colors.appBlue} name="check" />
            </View>
          )}
    </TouchableOpacity>
  );
};

export default SelectableButton;
