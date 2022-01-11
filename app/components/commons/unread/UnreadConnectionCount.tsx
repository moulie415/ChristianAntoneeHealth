import {Layout} from '@ui-kitten/components';
import React from 'react';
import {Text} from 'react-native';
import {connect} from 'react-redux';
import colors from '../../../constants/colors';
import DevicePixels from '../../../helpers/DevicePixels';
import {MyRootState} from '../../../types/Shared';

const UnreadConnectionCount: React.FC<{
  unread: {[key: string]: number};
  uid: string;
}> = ({unread, uid}) => {
  const count = unread[uid];
  if (count && count > 0) {
    return (
      <Layout
        style={{
          width: DevicePixels[22],
          height: DevicePixels[22],
          borderRadius: DevicePixels[11],
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.appRed,
        }}>
        <Text
          style={{
            fontSize: DevicePixels[12],
            fontWeight: 'bold',
            color: '#fff',
          }}>
          {count > 9 ? '9+' : count}
        </Text>
      </Layout>
    );
  }
  return null;
};

const mapStateToProps = ({profile}: MyRootState) => ({
  unread: profile.profile.unread,
});

export default connect(mapStateToProps)(UnreadConnectionCount);
