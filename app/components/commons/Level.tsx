import Icon from 'react-native-vector-icons/FontAwesome5';
import React from 'react';
import {View} from 'react-native';
import {Level} from '../../types/Shared';
import colors from '../../constants/colors';
import LevelIconProps from '../../types/commons/LevelIcon';
import {Layout} from '@ui-kitten/components';

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
      <Layout style={{flexDirection: 'row', alignSelf: 'center'}}>
        {star}
      </Layout>
    );
  }
  if (level === Level.INTERMEDIATE) {
    return (
      <Layout style={{flexDirection: 'row', alignSelf: 'center'}}>
        {star}
        {star}
      </Layout>
    );
  }
  return (
    <Layout style={{flexDirection: 'row', alignSelf: 'center'}}>
      {star}
      {star}
      {star}
    </Layout>
  );
};

export default LevelIcon;
