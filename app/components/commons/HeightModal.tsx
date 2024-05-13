import React from 'react';
import {Dimensions, View} from 'react-native';
import {RulerPicker} from 'react-native-ruler-picker';
import colors from '../../constants/colors';
import Button from './Button';
import Modal from './Modal';
import Text from './Text';

const windowWidth = Dimensions.get('window').width;

const HeightModal: React.FC<{
  visible: boolean;
  onRequestClose: () => void;
  height: number;
  setHeight: (height: number) => void;
}> = ({visible, onRequestClose, height, setHeight}) => {
  return (
    <Modal visible={visible} onRequestClose={onRequestClose}>
      <View
        style={{
          backgroundColor: colors.appGrey,
          width: windowWidth * 0.9,
          alignSelf: 'center',
          borderRadius: 10,
        }}>
        <Text
          style={{
            color: colors.appWhite,
            padding: 20,
            paddingBottom: 40,
            fontSize: 20,
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Select height
        </Text>

        <RulerPicker
          height={150}
          min={0}
          max={300}
          step={1}
          fractionDigits={0}
          width={windowWidth * 0.9}
          initialValue={height || 178}
          unitTextStyle={{color: colors.appWhite}}
          valueTextStyle={{color: colors.appWhite}}
          onValueChangeEnd={number => setHeight(Number(number))}
          unit="cm"
          indicatorColor={colors.appBlue}
        />
        <Button text="Close" style={{margin: 10}} onPress={onRequestClose} />
      </View>
    </Modal>
  );
};

export default HeightModal;
