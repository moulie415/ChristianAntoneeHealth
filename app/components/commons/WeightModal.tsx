import React, {useEffect, useMemo, useState} from 'react';
import {Dimensions, Platform, Text, View} from 'react-native';
import {RulerPicker} from 'react-native-ruler-picker';
import {Picker} from 'react-native-wheel-pick';
import {connect} from 'react-redux';
import {RootState} from '../../App';
import {DECIMAL_PLACES, WEIGHTS} from '../../constants';
import colors from '../../constants/colors';
import {getSampleItems} from '../../helpers';
import {Sample} from '../../types/Shared';
import Button from './Button';
import Modal from './Modal';
import ProfileGraph from './ProfileGraph';

const windowWidth = Dimensions.get('window').width;

const WeightModal: React.FC<{
  visible: boolean;
  setWeight: (weight: number) => void;
  setShowWeightModal: (show: boolean) => void;
  weight: number;
  weightSamples: Sample[];
  filter: 6 | 30 | 365;
}> = ({
  visible,
  setShowWeightModal,
  setWeight,
  weight,
  weightSamples,
  filter,
}) => {
  const [showWeightHistorical, setShowWeightHistorical] = useState(false);

  const weightItems: {
    data: {x: Date; y: number}[];
  } = useMemo(() => {
    return getSampleItems(weight, filter, weightSamples);
  }, [weight, weightSamples, filter]);

  return (
    <>
      <Modal visible={visible} onRequestClose={() => setShowWeightModal(false)}>
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
            Set weight
          </Text>
          <RulerPicker
            height={150}
            min={0}
            max={500}
            step={0.1}
            fractionDigits={1}
            width={windowWidth * 0.9}
            initialValue={weight ? weight : 80}
            unitTextStyle={{color: colors.appWhite}}
            valueTextStyle={{color: colors.appWhite}}
            onValueChangeEnd={number => setWeight(Number(number))}
            unit="kg"
            indicatorColor={colors.appBlue}
          />
          <Button
            text="View historical"
            style={{margin: 10, marginTop: 0}}
            onPress={() => {
              setShowWeightModal(false);
              setTimeout(() => {
                setShowWeightHistorical(true);
              }, 500);
            }}
          />
          <Button
            variant="secondary"
            text="Close"
            style={{margin: 10}}
            onPress={() => setShowWeightModal(false)}
          />
        </View>
      </Modal>
      <Modal
        visible={showWeightHistorical}
        onRequestClose={() => setShowWeightHistorical(false)}>
        <ProfileGraph
          data={weightItems.data}
          setShowModal={setShowWeightHistorical}
        />
      </Modal>
    </>
  );
};

const WeightModalAndroid: React.FC<{
  visible: boolean;
  setWeight: (weight: number) => void;
  setShowWeightModal: (show: boolean) => void;
  weight: number;
  weightSamples: Sample[];
  filter: 6 | 30 | 365;
}> = ({
  visible,
  setShowWeightModal,
  setWeight,
  weight,
  weightSamples,
  filter,
}) => {
  const [showWeightHistorical, setShowWeightHistorical] = useState(false);
  const [wholeNumber, setWholeNumber] = useState(Math.floor(weight)); // Separate state for the whole number part
  const [decimalPart, setDecimalPart] = useState(
    Number(String(weight).split('.')[1] || 0),
  ); // Separate state for the decimal part
  useEffect(() => {
    const newWeight = parseFloat(wholeNumber + '.' + decimalPart);
    setWeight(newWeight);
  }, [decimalPart, wholeNumber, setWeight]);

  const weightItems: {
    data: {x: Date; y: number}[];
  } = useMemo(() => {
    return getSampleItems(weight, filter, weightSamples);
  }, [weight, weightSamples, filter]);

  return (
    <>
      <Modal visible={visible} onRequestClose={() => setShowWeightModal(false)}>
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
            Set weight
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
                marginLeft: 5,
              }}>
              kg
            </Text>
          </View>
          <Button
            text="View historical"
            style={{margin: 10, marginTop: 0}}
            onPress={() => {
              setShowWeightModal(false);
              setTimeout(() => {
                setShowWeightHistorical(true);
              }, 500);
            }}
          />
          <Button
            variant="secondary"
            text="Close"
            style={{margin: 10}}
            onPress={() => setShowWeightModal(false)}
          />
        </View>
      </Modal>
      <Modal
        visible={showWeightHistorical}
        onRequestClose={() => setShowWeightHistorical(false)}>
        <ProfileGraph
          data={weightItems.data}
          setShowModal={setShowWeightHistorical}
        />
      </Modal>
    </>
  );
};

const mapStateToProps = ({profile}: RootState) => ({
  weightSamples: profile.weightSamples,
  filter: profile.filter,
});

export default connect(mapStateToProps)(
  Platform.OS === 'ios' ? WeightModal : WeightModalAndroid,
);
