import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import {TrainingAvailability} from '../../../types/Profile';

const SelectTrainingAvailability: React.FC<{
  trainingAvailability: TrainingAvailability;
  setTrainingAvailability: (availability: TrainingAvailability) => void;
}> = ({trainingAvailability, setTrainingAvailability}) => {
  return (
    <View>
      <Text
        category="h4"
        style={{
          textAlign: 'center',
          marginVertical: DevicePixels[20],
          width: DevicePixels[250],
          color: colors.appWhite,
        }}>
        How many days each week can you train?
      </Text>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: DevicePixels[175],
        }}>
        <TouchableOpacity
          onPress={() => setTrainingAvailability(TrainingAvailability.ONE_TWO)}
          style={{
            marginBottom: DevicePixels[20],
            backgroundColor:
              trainingAvailability === TrainingAvailability.ONE_TWO
                ? colors.darkBlue
                : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.darkBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color:
                trainingAvailability === TrainingAvailability.ONE_TWO
                  ? colors.appWhite
                  : colors.darkBlue,
            }}>
            1 - 2
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setTrainingAvailability(TrainingAvailability.TWO_THREE)
          }
          style={{
            marginBottom: DevicePixels[20],
            backgroundColor:
              trainingAvailability === TrainingAvailability.TWO_THREE
                ? colors.darkBlue
                : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.darkBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color:
                trainingAvailability === TrainingAvailability.TWO_THREE
                  ? colors.appWhite
                  : colors.darkBlue,
            }}>
            2 - 3
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setTrainingAvailability(TrainingAvailability.THREE_FOUR)
          }
          style={{
            marginBottom: DevicePixels[20],
            backgroundColor:
              trainingAvailability === TrainingAvailability.THREE_FOUR
                ? colors.darkBlue
                : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.darkBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color:
                trainingAvailability === TrainingAvailability.THREE_FOUR
                  ? colors.appWhite
                  : colors.darkBlue,
            }}>
            3 - 4
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setTrainingAvailability(TrainingAvailability.FOUR_PLUS)
          }
          style={{
            marginBottom: DevicePixels[20],
            backgroundColor:
              trainingAvailability === TrainingAvailability.FOUR_PLUS
                ? colors.darkBlue
                : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.darkBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color:
                trainingAvailability === TrainingAvailability.FOUR_PLUS
                  ? colors.appWhite
                  : colors.darkBlue,
            }}>
            4+
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectTrainingAvailability;
