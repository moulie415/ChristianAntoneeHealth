import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Level} from '../../../types/Shared';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import Button from '../../commons/Button';

const SelectExperience: React.FC<{
  experience: Level;
  setExperience: (experience: Level) => void;
}> = ({experience, setExperience}) => {
  return (
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
          color: colors.appWhite,
          fontSize: DevicePixels[20],
        }}>
        What's your experience level?
      </Text>
      <Button
        text="No clue what I'm doing"
        style={{marginBottom: DevicePixels[20]}}
        onPress={() => setExperience(Level.BEGINNER)}
        variant={experience === Level.BEGINNER ? 'primary' : 'secondary'}
      />
      <Button
        text="I workout every now and again"
        style={{marginBottom: DevicePixels[20]}}
        onPress={() => setExperience(Level.INTERMEDIATE)}
        variant={experience === Level.INTERMEDIATE ? 'primary' : 'secondary'}
      />
      <Button
        text="I’m a seasoned veteran"
        style={{marginBottom: DevicePixels[20]}}
        onPress={() => setExperience(Level.ADVANCED)}
        variant={experience === Level.ADVANCED ? 'primary' : 'secondary'}
      />
    </View>
  );
};

export default SelectExperience;
