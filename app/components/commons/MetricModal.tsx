import React from 'react';
import { Dimensions, View } from 'react-native';
import { RulerPicker } from 'react-native-ruler-picker';
import colors from '../../constants/colors';
import Button from './Button';
import Modal from './Modal';
import Text from './Text';

const windowWidth = Dimensions.get('window').width;

const MetricModal: React.FC<{
  visible: boolean;
  onRequestClose: () => void;
  selectedValue?: number;
  onValueChange: (val: number) => void;
  title?: string;
  unit?: string;
  min: number;
  max: number;
  step?: number;
  fractionDigits?: number;
}> = ({
  visible,
  onRequestClose,
  selectedValue,
  unit,
  onValueChange,
  title,
  min,
  max,
  step,
  fractionDigits,
}) => {
  return (
    <Modal visible={visible} onRequestClose={onRequestClose}>
      <View
        style={{
          backgroundColor: colors.appGrey,
          width: windowWidth * 0.9,
          alignSelf: 'center',
          borderRadius: 10,
        }}
      >
        {!!title && (
          <Text
            style={{
              color: colors.appWhite,
              padding: 20,
              paddingBottom: 40,
              fontSize: 20,
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            {title}
          </Text>
        )}
        <RulerPicker
          height={150}
          min={min}
          max={max}
          step={step || 1}
          fractionDigits={fractionDigits || 0}
          width={windowWidth * 0.9}
          initialValue={selectedValue || 0}
          unitTextStyle={{ color: colors.appWhite }}
          valueTextStyle={{ color: colors.appWhite }}
          onValueChangeEnd={number => onValueChange(Number(number))}
          unit={unit || ''}
          indicatorColor={colors.appBlue}
        />
        <Button text="Close" style={{ margin: 10 }} onPress={onRequestClose} />
      </View>
    </Modal>
  );
};

export default MetricModal;
