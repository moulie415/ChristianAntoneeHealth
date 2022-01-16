import React from 'react';
import {connect} from 'react-redux';
import {Text, Layout} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {MyRootState} from '../../../types/Shared';
import colors from '../../../constants/colors';
import DevicePixels from '../../../helpers/DevicePixels';
import Profile from '../../../types/Profile';

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
        <Layout
          style={{
            width: DevicePixels[17],
            height: DevicePixels[17],
            borderRadius: DevicePixels[9],
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            top: DevicePixels[3],
            right: DevicePixels[17],
            backgroundColor: colors.appRed,
          }}>
          <Text
            style={{
              fontSize: DevicePixels[10],
              fontWeight: 'bold',
              color: '#fff',
            }}>
            {count > 9 ? '9+' : count}
          </Text>
        </Layout>
      )}
    </>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(MoreIcon);
