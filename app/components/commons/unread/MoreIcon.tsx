import React from 'react';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {MyRootState} from '../../../types/Shared';
import colors from '../../../constants/colors';

import Profile from '../../../types/Profile';
import {View} from 'react-native';
import Text from '../Text';

const MoreIcon: React.FC<{
  profile: Profile;
  size: number;
  color: string;
}> = ({size, color, profile}) => {
  const count = Object.values(profile.unread || {}).reduce(
    (acc, cur) => acc + cur,
    0,
  );
  return (
    <>
      <Icon name="ellipsis-h" size={size} color={color} />
      {profile.premium && count > 0 && (
        <View
          style={{
            width: 17,
            height: 17,
            borderRadius: 9,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            top: 3,
            right: 17,
            backgroundColor: colors.appRed,
          }}>
          <Text
            style={{
              fontSize: 10,
              fontWeight: 'bold',
              color: '#fff',
            }}>
            {count > 9 ? '9+' : count}
          </Text>
        </View>
      )}
    </>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(MoreIcon);
