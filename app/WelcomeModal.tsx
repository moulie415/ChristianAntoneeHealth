import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from './components/commons/Modal';
import colors from './constants/colors';
import DevicePixels from './helpers/DevicePixels';
import GoalSummaries from './components/commons/GoalSummaries';
import Button from './components/commons/Button';
import {
  useTourGuideController, // hook to start, etc.
} from 'rn-tourguide';
import {MyRootState} from './types/Shared';
import {connect} from 'react-redux';

const WelcomeModal: React.FC<{
  showSplash: boolean;
  hasViewedTour: boolean;
}> = ({hasViewedTour, showSplash}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const {
    canStart, // a boolean indicate if you can start tour guide
    start, // a function to start the tourguide
    getCurrentStep,
  } = useTourGuideController();

  useEffect(() => {
    if (!hasViewedTour && !showSplash) {
      setModalVisible(true);
    }
  }, [showSplash, hasViewedTour]);
  return (
    <Modal
      disableBackDrop
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View
        style={{
          backgroundColor: colors.appGrey,
          alignSelf: 'center',
          borderRadius: DevicePixels[10],
          padding: DevicePixels[20],
          width: '95%',
        }}>
        <Text
          style={{
            textAlign: 'center',
            padding: DevicePixels[15],
            paddingTop: 0,
            fontSize: DevicePixels[25],
            color: colors.appWhite,
            fontWeight: 'bold',
          }}>
          Welcome to CA Health
        </Text>
        <Text style={{color: colors.appWhite, textAlign: 'center'}}>
          Here are your...
        </Text>
        <GoalSummaries />
        <Button
          text="Start tour"
          onPress={() => {
            setModalVisible(false);
            start();
            // setViewed
          }}
        />
        <Button
          style={{marginTop: DevicePixels[10]}}
          text="Skip"
          onPress={() => {
            setModalVisible(false);
            // setViewed()
          }}
        />
      </View>
    </Modal>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  hasViewedTour: profile.hasViewedTour,
});

export default connect(mapStateToProps)(WelcomeModal);
