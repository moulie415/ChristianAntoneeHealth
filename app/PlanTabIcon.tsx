import {View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';
import {MyRootState} from './types/Shared';
import Profile from './types/Profile';
import Text from './components/commons/Text';
import colors from './constants/colors';

const PlanTabIcon: React.FC<{
  color: string;
  size: number;
  profile: Profile;
}> = ({color, size, profile}) => {
  const count = profile.unread?.plan || 0;
  return (
    <View>
      <Icon color={color} size={size} name="calendar-days" solid />
      {profile.premium && count > 0 && (
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            top: -5,
            right: -10,
            backgroundColor: colors.appRed,
          }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              color: colors.appWhite,
            }}>
            {count > 9 ? '9+' : count}
          </Text>
        </View>
      )}
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(PlanTabIcon);
