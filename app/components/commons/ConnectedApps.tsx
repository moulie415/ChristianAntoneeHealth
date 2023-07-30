import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import Profile from '../../types/Profile';
import ConnectedAppsModal from './ConnectedAppsModal';
import Button from './Button';
import {getActivityDetails} from '../../helpers/garmin';
import moment from 'moment';
import {getHeartRateSamplesWithRange} from '../../helpers/polar';

const ConnectedApps: React.FC<{
  profile: Profile;
}> = ({profile}) => {
  const [showModal, setShowModal] = useState(false);
  const {polarAccessToken, fitbitRefreshToken, fitbitToken} = profile;

  console.log({
    polarAccessToken,
    fitbitRefreshToken,
    fitbitToken,
  });

  useEffect(() => {
    getHeartRateSamplesWithRange(
      polarAccessToken,
      moment().startOf('day').toDate(),
      moment().endOf('day').toDate(),
    );
  }, [polarAccessToken]);
  return (
    <>
      <View>
        <Button text="connect" onPress={() => setShowModal(true)} />
      </View>
      <ConnectedAppsModal visible={showModal} setVisible={setShowModal} />
    </>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(ConnectedApps);
