import {View, Text} from 'react-native';
import React from 'react';
import Modal from './components/commons/Modal';
import colors from './constants/colors';
import DevicePixels from './helpers/DevicePixels';
import {useSpotlightTour} from '@stackbuilders/react-native-spotlight-tour';
import GoalSummaries from './components/commons/GoalSummaries';
import Button from './components/commons/Button';

const WelcomeModal: React.FC<{
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}> = ({modalVisible, setModalVisible}) => {

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

export default WelcomeModal;
