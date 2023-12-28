import Icon from 'react-native-vector-icons/FontAwesome6';
import React from 'react';
import {View} from 'react-native';
import {Level} from '../../types/Shared';
import colors from '../../constants/colors';
import LevelIconProps from '../../types/commons/LevelIcon';

const LevelIcon: React.FC<LevelIconProps> = ({level, size}) => {
  const star = (
    <Icon name="star" solid color={colors.appBlue} size={size || 12} />
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
      <View style={{flexDirection: 'row', alignSelf: 'center'}}>{star}</View>
    );
  }
  if (level === Level.INTERMEDIATE) {
    return (
      <View style={{flexDirection: 'row', alignSelf: 'center'}}>
        {star}
        {star}
      </View>
    );
  }
  return (
    <View style={{flexDirection: 'row', alignSelf: 'center'}}>
      {star}
      {star}
      {star}
    </View>
  );
};

export default LevelIcon;
