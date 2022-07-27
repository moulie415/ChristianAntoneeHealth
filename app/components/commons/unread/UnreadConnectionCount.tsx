import React from 'react';
import {Text, View} from 'react-native';
import {connect} from 'react-redux';
import colors from '../../../constants/colors';
import DevicePixels from '../../../helpers/DevicePixels';
import {MyRootState} from '../../../types/Shared';

const UnreadConnectionCount: React.FC<{
  unread: {[key: string]: number};
  uid: string;
}> = ({unread, uid}) => {
  if (!unread) {
    return null;
  }
  const count = unread[uid];
  if (count && count > 0) {
    return (
      <View
        style={{
          width: DevicePixels[18],
          height: DevicePixels[18],
          borderRadius: DevicePixels[9],
          alignItems: 'center',
          justifyContent: 'center',
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
      </View>
    );
  }
  return null;
};

const mapStateToProps = ({profile}: MyRootState) => ({
  unread: profile.profile.unread,
});

export default connect(mapStateToProps)(UnreadConnectionCount);
