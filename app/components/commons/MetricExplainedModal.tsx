import {View, Text} from 'react-native';
import React from 'react';
import Modal from './Modal';
import Button from './Button';
import DevicePixels from '../../helpers/DevicePixels';

const MetricExplainedModal: React.FC<{
  visible: boolean;
  onRequestClose: () => void;
}> = ({visible, onRequestClose}) => {
  return (
    <Modal visible={visible} onRequestClose={onRequestClose}>
      <View
        style={{
          backgroundColor: '#fff',
          width: '90%',
          alignSelf: 'center',
          borderRadius: DevicePixels[10],
        }}>
        <Button
          text="Close"
          style={{margin: DevicePixels[10]}}
          onPress={onRequestClose}
        />
      </View>
    </Modal>
  );
};

export default MetricExplainedModal;
