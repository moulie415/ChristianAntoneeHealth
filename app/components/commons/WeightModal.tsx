import React, {useMemo, useState} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {RulerPicker} from 'react-native-ruler-picker';
import {connect} from 'react-redux';
import {RootState} from '../../App';
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

const mapStateToProps = ({profile}: RootState) => ({
  weightSamples: profile.weightSamples,
  filter: profile.filter,
});

export default connect(mapStateToProps)(WeightModal);
