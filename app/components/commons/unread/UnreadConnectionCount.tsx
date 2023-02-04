import React from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import colors from '../../../constants/colors';

import {MyRootState} from '../../../types/Shared';
import Text from '../Text';

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
          width: 18,
          height: 18,
          borderRadius: 9,
          alignItems: 'center',
          justifyContent: 'center',
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
    );
  }
  return null;
};

const mapStateToProps = ({profile}: MyRootState) => ({
  unread: profile.profile.unread,
});

export default connect(mapStateToProps)(UnreadConnectionCount);
