import React, {useMemo, useState} from 'react';
import {Text, View} from 'react-native';
import {Picker} from 'react-native-wheel-pick';
import {connect} from 'react-redux';
import {WEIGHTS} from '../../constants';
import colors from '../../constants/colors';
import {getSampleItems} from '../../helpers';
import {MyRootState, Sample} from '../../types/Shared';
import Button from './Button';
import Modal from './Modal';
import ProfileGraph from './ProfileGraph';

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
    lowest: number;
    highest: number;
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

          {/*  @ts-ignore */}
          <Picker
            style={{
              height: 200,
              paddingHorizontal: 20,
              backgroundColor: 'transparent',
            }}
            selectedValue={String(weight)}
            textColor={colors.appWhite}
            itemStyle={{color: colors.appWhite}}
            pickerData={WEIGHTS.map(value => {
              return {
                label: `${value.toString()} kg`,
                value: String(value),
              };
            })}
            onValueChange={(val: string) => setWeight(Number(val))}
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

const mapStateToProps = ({profile, settings}: MyRootState) => ({
  weightSamples: profile.weightSamples,
  filter: profile.filter,
});

export default connect(mapStateToProps)(WeightModal);
