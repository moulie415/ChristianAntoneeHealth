import React from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import colors from '../../../constants/colors';

import {RootState} from '../../../App';
import Text from '../Text';

const UnreadConnectionCount: React.FC<{
  unread: {[key: string]: number} | undefined;
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

const mapStateToProps = ({profile}: RootState) => ({
  unread: profile.profile.unread,
});

export default connect(mapStateToProps)(UnreadConnectionCount);
