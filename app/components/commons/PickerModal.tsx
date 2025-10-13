import React from 'react';
import { View } from 'react-native';
import Picker, { OnValueChanged, PickerItem } from '@quidone/react-native-wheel-picker';
import colors from '../../constants/colors';
import { Gender } from '../../types/Shared';
import Button from './Button';
import Modal from './Modal';
import Text from './Text';

const PickerModal: React.FC<{
  visible: boolean;
  onRequestClose: () => void;
  selectedValue: string | Date | Gender;
  pickerData: any;
  onValueChange: OnValueChanged<PickerItem<any>>, 
  title?: string;
}> = ({
  visible,
  onRequestClose,
  selectedValue,
  pickerData,
  onValueChange,
  title,
}) => {
  return (
    <Modal visible={visible} onRequestClose={onRequestClose}>
      <View
        style={{
          backgroundColor: colors.appGrey,
          width: '90%',
          alignSelf: 'center',
          borderRadius: 10,
        }}
      >
        {!!title && (
          <Text
            style={{
              color: colors.appWhite,
              padding: 20,
              paddingBottom: 10,
              fontSize: 20,
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            {title}
          </Text>
        )}
        <Picker
          style={{
            height: 200,
            paddingHorizontal: 20,
            backgroundColor: 'transparent',
          }}
          itemTextStyle={{ color: colors.appWhite }}
          value={selectedValue}
          data={pickerData}
          onValueChanged={onValueChange}
        />
        <Button text="Close" style={{ margin: 10 }} onPress={onRequestClose} />
      </View>
    </Modal>
  );
};

export default PickerModal;
