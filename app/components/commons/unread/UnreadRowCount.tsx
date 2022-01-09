import React from 'react';
import {connect} from 'react-redux';
import {Text, Layout} from '@ui-kitten/components';
import {MyRootState} from '../../../types/Shared';
import colors from '../../../constants/colors';

const UnreadRowCount: React.FC<{unread: {[key: string]: number}}> = ({
  unread,
}) => {
  const count = Object.values(unread || {}).reduce((acc, cur) => acc + cur, 0);
  if (count > 0) {
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

export default connect(mapStateToProps)(UnreadRowCount);
