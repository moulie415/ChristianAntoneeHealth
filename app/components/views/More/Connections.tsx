import {Divider, Layout, List, ListItem} from '@ui-kitten/components';
import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {MyRootState} from '../../../types/Shared';
import Profile from '../../../types/Profile';
import {getConnections} from '../../../actions/profile';
import Avatar from '../../commons/Avatar';
import {RefreshControl} from 'react-native';

const Connections: React.FC<{
  profile: Profile;
  connections: {[key: string]: Profile};
  getConnectionsAction: () => void;
  loading: boolean;
}> = ({profile, connections, getConnectionsAction, loading}) => {
  useEffect(() => {
    getConnectionsAction();
  }, [getConnectionsAction]);
  return (
    <Layout style={{flex: 1}}>
      <List
        data={Object.values(connections)}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={getConnectionsAction}
          />
        }
        renderItem={({item}) => (
          <ListItem
            title={item.name}
            accessoryLeft={() => (
              <Avatar src={item.avatar} name={item.name} size={50} />
            )}
          />
        )}
        ItemSeparatorComponent={() => <Divider />}
      />
    </Layout>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
  connections: profile.connections,
  loading: profile.loading,
});

const mapDispatchToProps = {
  getConnectionsAction: getConnections,
};

export default connect(mapStateToProps, mapDispatchToProps)(Connections);
