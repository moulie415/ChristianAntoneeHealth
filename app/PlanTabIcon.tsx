import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';
import Text from './components/commons/Text';
import colors from './constants/colors';
import {hasPremiumPlus} from './helpers/hasPremiumPlus';
import {Profile} from './types/Shared';
import {MyRootState} from './types/Shared';

const PlanTabIcon: React.FC<{
  color: string;
  size: number;
  profile: Profile;
}> = ({color, size, profile}) => {
  const count = profile.unread?.plan || 0;
  return (
    <View>
      <Icon color={color} size={size} name="calendar-days" solid />
      {!(profile.admin || hasPremiumPlus(profile.premium)) && (
        <Icon
          name="lock"
          color={colors.appBlue}
          size={15}
          style={{position: 'absolute', top: -5, right: -5}}
        />
      )}
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
