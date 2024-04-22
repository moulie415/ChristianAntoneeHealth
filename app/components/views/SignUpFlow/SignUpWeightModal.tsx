import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Picker} from 'react-native-wheel-pick';
import {DECIMAL_PLACES, WEIGHTS} from '../../../constants';
import colors from '../../../constants/colors';
import Button from '../../commons/Button';
import Modal from '../../commons/Modal';
import Text from '../../commons/Text';

const SignUpWeightModal: React.FC<{
  visible: boolean;
  onRequestClose: () => void;
  weight: number;
  setWeight: (val: number) => void;
}> = ({visible, onRequestClose, weight, setWeight}) => {
  const [wholeNumber, setWholeNumber] = useState(Math.floor(weight));
  const [decimalPart, setDecimalPart] = useState(
    Number(String(weight).split('.')[1] || 0),
  );

  useEffect(() => {
    const newWeight = parseFloat(wholeNumber + '.' + decimalPart);
    setWeight(newWeight);
  }, [decimalPart, wholeNumber, setWeight]);
  return (
    <Modal visible={visible} onRequestClose={onRequestClose}>
      <View
        style={{
          backgroundColor: colors.appGrey,
          width: '90%',
          alignSelf: 'center',
          borderRadius: 10,
        }}>
        <Text
          style={{
            color: colors.appWhite,
            padding: 20,
            paddingBottom: 10,
            fontSize: 20,
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Select weight
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Picker
            style={{
              height: 200,
              backgroundColor: 'transparent',
              width: 90,
              alignSelf: 'center',
            }}
            selectedValue={String(wholeNumber)}
            textColor={colors.appWhite}
            itemStyle={{color: colors.appWhite}}
            pickerData={WEIGHTS.map(value => {
              return {
                label: value.toString(),
                value: String(value),
              };
            })}
            onValueChange={(val: string) => setWholeNumber(Number(val))}
          />
          <Text
            style={{
              color: colors.appWhite,
              fontWeight: 'bold',
              fontSize: 18,
              marginTop: 5,
            }}>
            .
          </Text>
          <Picker
            style={{
              height: 200,
              backgroundColor: 'transparent',
              width: 90,
              alignSelf: 'center',
            }}
            selectedValue={String(decimalPart)}
            textColor={colors.appWhite}
            itemStyle={{color: colors.appWhite}}
            pickerData={DECIMAL_PLACES.map(value => {
              return {
                label: value.toString(),
                value: String(value),
              };
            })}
            onValueChange={(val: string) => setDecimalPart(Number(val))}
          />
          <Text
            style={{
              color: colors.appWhite,
              fontWeight: 'bold',
              fontSize: 18,
              marginTop: 15,
            }}>
            kg
          </Text>
        </View>
        <Button text="Close" style={{margin: 10}} onPress={onRequestClose} />
      </View>
    </Modal>
  );
};

export default SignUpWeightModal;
