import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import colors from './constants/colors';
import {useAppSelector} from './hooks/redux';

const LeaderboardTabIcon: React.FC<{
  color: string;
  size: number;
}> = ({color, size}) => {
  const {profile} = useAppSelector(state => state.profile);
  return (
    <View>
      <Icon color={color} size={size} name="trophy" />
      {!profile.premium && (
        <Icon
          name="lock"
          color={colors.appBlue}
          size={15}
          style={{position: 'absolute', top: -5, right: -5}}
        />
      )}
    </View>
  );
};

export default LeaderboardTabIcon;
