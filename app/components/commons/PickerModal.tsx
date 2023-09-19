import {View} from 'react-native';
import React from 'react';
import Modal from './Modal';

import {Picker} from 'react-native-wheel-pick';
import Button from './Button';
import colors from '../../constants/colors';
import Text from './Text';
import {Gender} from '../../types/Profile';

const PickerModal: React.FC<{
  visible: boolean;
  onRequestClose: () => void;
  selectedValue: string | Date | Gender;
  pickerData: any;
  onValueChange: (val: string | Gender) => void;
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
        }}>
        {!!title && (
          <Text
            style={{
              color: colors.appWhite,
              padding: 20,
              paddingBottom: 10,
              fontSize: 20,
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            {title}
          </Text>
        )}
        {/*  @ts-ignore */}
        <Picker
          style={{
            height: 200,
            paddingHorizontal: 20,
            backgroundColor: 'transparent',
          }}
          selectedValue={selectedValue}
          textColor={colors.appWhite}
          itemStyle={{color: colors.appWhite}}
          pickerData={pickerData}
          onValueChange={onValueChange}
        />
        <Button text="Close" style={{margin: 10}} onPress={onRequestClose} />
      </View>
    </Modal>
  );
};

export default PickerModal;
