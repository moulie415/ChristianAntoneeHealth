import React, {ReactNode} from 'react';
import {View} from 'react-native';
import RNModal from 'react-native-modal';
import DevicePixels from '../../helpers/DevicePixels';

const Modal: React.FC<{
  visible?: boolean;
  onRequestClose?: () => void;
  children: ReactNode;
}> = ({children, visible, onRequestClose}) => {
  return (
    <RNModal
      onBackButtonPress={() => onRequestClose && onRequestClose()}
      onBackdropPress={() => onRequestClose && onRequestClose()}
      isVisible={visible}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {children}
      </View>
    </RNModal>
  );
};

export default Modal;
