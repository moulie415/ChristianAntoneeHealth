import React from 'react';
import {View} from 'react-native';
import colors from '../../../constants/colors';
import {TrainingAvailability} from '../../../types/Shared';
import Button from '../../commons/Button';
import Text from '../../commons/Text';

const SelectTrainingAvailability: React.FC<{
  trainingAvailability: TrainingAvailability;
  setTrainingAvailability: (availability: TrainingAvailability) => void;
}> = ({trainingAvailability, setTrainingAvailability}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        margin: 50,
      }}>
      <Text
        style={{
          textAlign: 'center',
          marginVertical: 20,
          fontSize: 20,
          color: colors.appWhite,
        }}>
        How many days each week can you train?
      </Text>

      <Button
        text="1 - 2"
        onPress={() => setTrainingAvailability(TrainingAvailability.ONE_TWO)}
        style={{
          marginBottom: 20,
          marginHorizontal: 20,
        }}
        variant={
          trainingAvailability === TrainingAvailability.ONE_TWO
            ? 'primary'
            : 'secondary'
        }
      />
      <Button
        text="2 - 3"
        onPress={() => setTrainingAvailability(TrainingAvailability.TWO_THREE)}
        style={{
          marginBottom: 20,
          marginHorizontal: 20,
        }}
        variant={
          trainingAvailability === TrainingAvailability.TWO_THREE
            ? 'primary'
            : 'secondary'
        }
      />
      <Button
        text="3 - 4"
        onPress={() => setTrainingAvailability(TrainingAvailability.THREE_FOUR)}
        style={{
          marginBottom: 20,
          marginHorizontal: 20,
        }}
        variant={
          trainingAvailability === TrainingAvailability.THREE_FOUR
            ? 'primary'
            : 'secondary'
        }
      />
      <Button
        text="4+"
        onPress={() => setTrainingAvailability(TrainingAvailability.FOUR_PLUS)}
        style={{
          marginBottom: 20,
          marginHorizontal: 20,
        }}
        variant={
          trainingAvailability === TrainingAvailability.FOUR_PLUS
            ? 'primary'
            : 'secondary'
        }
      />
    </View>
  );
};

export default SelectTrainingAvailability;
