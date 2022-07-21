import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import {TrainingAvailability} from '../../../types/Profile';
import Button from '../../commons/Button';

const SelectTrainingAvailability: React.FC<{
  trainingAvailability: TrainingAvailability;
  setTrainingAvailability: (availability: TrainingAvailability) => void;
}> = ({trainingAvailability, setTrainingAvailability}) => {
  return (
    <ImageBackground
      source={require('../../../images/login.jpeg')}
      blurRadius={5}
      style={{
        flex: 1,
      }}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.appBlack,
          opacity: 0.5,
        }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          margin: DevicePixels[50],
        }}>
        <Text
          style={{
            textAlign: 'center',
            marginVertical: DevicePixels[20],
            fontSize: DevicePixels[20],
            color: colors.appWhite,
          }}>
          How many days each week can you train?
        </Text>

        <Button
          text="1 - 2"
          onPress={() => setTrainingAvailability(TrainingAvailability.ONE_TWO)}
          style={{
            marginBottom: DevicePixels[20],
          }}
          variant={
            trainingAvailability === TrainingAvailability.ONE_TWO
              ? 'primary'
              : 'secondary'
          }
        />
        <Button
          text="2 - 3"
          onPress={() =>
            setTrainingAvailability(TrainingAvailability.TWO_THREE)
          }
          style={{
            marginBottom: DevicePixels[20],
          }}
          variant={
            trainingAvailability === TrainingAvailability.TWO_THREE
              ? 'primary'
              : 'secondary'
          }
        />
        <Button
          text="3 - 4"
          onPress={() =>
            setTrainingAvailability(TrainingAvailability.THREE_FOUR)
          }
          style={{
            marginBottom: DevicePixels[20],
          }}
          variant={
            trainingAvailability === TrainingAvailability.THREE_FOUR
              ? 'primary'
              : 'secondary'
          }
        />
        <Button
          text="4+"
          onPress={() =>
            setTrainingAvailability(TrainingAvailability.FOUR_PLUS)
          }
          style={{
            marginBottom: DevicePixels[20],
          }}
          variant={
            trainingAvailability === TrainingAvailability.FOUR_PLUS
              ? 'primary'
              : 'secondary'
          }
        />
      </View>
    </ImageBackground>
  );
};

export default SelectTrainingAvailability;
