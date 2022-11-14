import {View} from 'react-native';
import React from 'react';
import Modal from './Modal';
import DevicePixels from '../../helpers/DevicePixels';
import {Picker} from 'react-native-wheel-pick';
import Button from './Button';

const PickerModal: React.FC<{
  visible: boolean;
  onRequestClose: () => void;
  selectedValue: string;
  pickerData: any;
  onValueChange: (val: string) => void;
}> = ({visible, onRequestClose, selectedValue, pickerData, onValueChange}) => {
  return (
    <Modal visible={visible} onRequestClose={onRequestClose}>
      <View
        style={{
          backgroundColor: '#fff',
          width: '90%',
          alignSelf: 'center',
          borderRadius: DevicePixels[10],
        }}>
        <Picker
          style={{height: DevicePixels[200], backgroundColor: 'transparent'}}
          /* @ts-ignore */
          selectedValue={selectedValue}
          pickerData={pickerData}
          onValueChange={onValueChange}
        />
        <Button
          text="Close"
          style={{margin: DevicePixels[10]}}
          onPress={onRequestClose}
        />
      </View>
    </Modal>
  );
};

export default PickerModal;
