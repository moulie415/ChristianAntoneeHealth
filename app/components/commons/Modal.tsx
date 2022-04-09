import React from 'react';
import {Modal as UIModal} from '@ui-kitten/components';

const Modal: React.FC<{visible?: boolean; onBackDropPress?: () => void}> = ({
  children,
  visible,
  onBackDropPress,
}) => {
  return (
    <UIModal
      backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
      onBackdropPress={() => {
        if (onBackDropPress) {
          onBackDropPress();
        }
      }}
      visible={visible}>
      {children}
    </UIModal>
  );
};

export default Modal;
