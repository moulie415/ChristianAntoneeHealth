import {Divider, Layout, List, ListItem} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {MyRootState} from '../../../types/Shared';
import Profile from '../../../types/Profile';
import {getConnections} from '../../../actions/profile';
import Avatar from '../../commons/Avatar';

const Connections: React.FC<{
  profile: Profile;
  connections: {[key: string]: Profile};
  getConnectionsAction: () => void;
}> = ({profile, connections, getConnectionsAction}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getConnectionsAction();
  }, [getConnectionsAction]);
  return (
    <Layout style={{flex: 1}}>
      <List
        data={Object.values(connections)}
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
});

const mapDispatchToProps = {
  getConnectionsAction: getConnections,
};

export default connect(mapStateToProps, mapDispatchToProps)(Connections);
