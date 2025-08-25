import React, { ReactNode } from 'react';
import { Modal as RNModal, View } from 'react-native';
// import RNModal from 'react-native-modal';

const Modal: React.FC<{
  visible?: boolean;
  onRequestClose?: () => void;
  children: ReactNode;
  disableBackDrop?: boolean;
}> = ({ children, visible, onRequestClose, disableBackDrop }) => {
  return (
    <RNModal
      animationType="fade"
      backdropColor={'rgba(0,0,0,0.5)'}
      onRequestClose={() => onRequestClose && onRequestClose()}
      onDismiss={() => !disableBackDrop && onRequestClose && onRequestClose()}
      visible={visible}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {children}
      </View>
    </RNModal>
  );
};

export default Modal;
