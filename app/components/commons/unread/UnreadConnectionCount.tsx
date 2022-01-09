import {Layout} from '@ui-kitten/components';
import React from 'react';
import {Text} from 'react-native';
import {connect} from 'react-redux';
import colors from '../../../constants/colors';
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
          marginLeft: 5,
          width: 22,
          height: 22,
          borderRadius: 11,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.appRed,
        }}>
        <Text style={{fontSize: 12, fontWeight: 'bold', color: '#fff'}}>
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
