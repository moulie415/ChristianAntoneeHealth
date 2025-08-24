import {FontAwesome6} from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import {connect} from 'react-redux';
import {RootState} from '../../../App';
import colors from '../../../constants/colors';

import {View} from 'react-native';
import {Profile} from '../../../types/Shared';
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
      <FontAwesome6
        name="ellipsis"
        iconStyle="solid"
        size={size}
        color={color}
      />
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

const mapStateToProps = ({profile}: RootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(MoreIcon);
