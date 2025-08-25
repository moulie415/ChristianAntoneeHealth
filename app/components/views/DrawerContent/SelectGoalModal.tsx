import React from 'react';
import { View } from 'react-native';
import colors from '../../../constants/colors';
import { useAppSelector } from '../../../hooks/redux';
import { Goal } from '../../../types/Shared';
import Button from '../../commons/Button';
import Modal from '../../commons/Modal';
import SelectableButton from '../../commons/SelectableButton';
import Text from '../../commons/Text';
import { goalDetails } from '../SignUpFlow/SelectGoal';

const SelectGoalModal: React.FC<{
  goalModalVisible: boolean;
  setGoalModalVisible: (visible: boolean) => void;
  goal: Goal;
  setGoal: (goal: Goal) => void;
}> = ({ goalModalVisible, setGoalModalVisible, goal, setGoal }) => {
  const { profile } = useAppSelector(state => state.profile);
  return (
    <Modal
      visible={goalModalVisible}
      onRequestClose={() => setGoalModalVisible(false)}
    >
      <View
        style={{
          backgroundColor: colors.appGrey,
          padding: 10,
          borderRadius: 10,
          width: '95%',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            padding: 15,
            fontSize: 20,
            color: colors.appWhite,
            fontWeight: 'bold',
          }}
        >
          Select Goal
        </Text>
        <View style={{}}>
          {goalDetails.map(({ text, secondaryText, goal: g }) => {
            if (g === Goal.OTHER && !profile.client) {
              return null;
            }
            return (
              <SelectableButton
                key={g}
                text={text}
                secondaryText={secondaryText}
                selected={g === goal}
                onPress={() => setGoal(g)}
                style={{ marginBottom: 15 }}
              />
            );
          })}
        </View>
        <Button
          text="Close"
          style={{ marginVertical: 10 }}
          onPress={() => setGoalModalVisible(false)}
        />
      </View>
    </Modal>
  );
};

export default SelectGoalModal;
