import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { View } from 'react-native';
import colors from '../../constants/colors';
import { Level } from '../../types/Shared';
import LevelIconProps from '../../types/commons/LevelIcon';

const LevelIcon: React.FC<LevelIconProps> = ({ level, size }) => {
  const star = (
    <FontAwesome6
      name="star"
      iconStyle="solid"
      color={colors.appBlue}
      size={size || 12}
    />
  );
  if (
    !level ||
    (level !== Level.BEGINNER &&
      level !== Level.INTERMEDIATE &&
      level !== Level.ADVANCED)
  ) {
    return null;
  }
  if (level === Level.BEGINNER) {
    return (
      <View style={{ flexDirection: 'row', alignSelf: 'center' }}>{star}</View>
    );
  }
  if (level === Level.INTERMEDIATE) {
    return (
      <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
        {star}
        {star}
      </View>
    );
  }
  return (
    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
      {star}
      {star}
      {star}
    </View>
  );
};

export default LevelIcon;
