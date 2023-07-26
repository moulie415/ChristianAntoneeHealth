import {View, Linking} from 'react-native';
import React from 'react';
import Button from './Button';
import Config from 'react-native-config';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import Profile from '../../types/Profile';

const ConnectedApps: React.FC<{profile: Profile}> = ({profile}) => {
  return (
    <View>
      <Button
        text="connect"
        onPress={() =>
          Linking.openURL(`${Config.GARMIN_OAUTH_URL}?uid=${profile.uid}`)
        }
      />
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(ConnectedApps);
