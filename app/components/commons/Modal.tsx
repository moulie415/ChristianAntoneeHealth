import React, {ReactNode} from 'react';
import {Modal as RNModal, View} from 'react-native';
import DevicePixels from '../../helpers/DevicePixels';

const Modal: React.FC<{
  visible?: boolean;
  onRequestClose?: () => void;
  children: ReactNode;
}> = ({children, visible, onRequestClose}) => {
  return (
    <RNModal
      onRequestClose={() => onRequestClose && onRequestClose()}
      transparent
      animationType="slide"
      // backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
      visible={visible}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {children}
      </View>
    </RNModal>
  );
};

export default Modal;
