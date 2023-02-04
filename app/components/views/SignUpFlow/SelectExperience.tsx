import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Level} from '../../../types/Shared';
import Text from '../../commons/Text';

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
        margin: 50,
      }}>
      <Text
        style={{
          textAlign: 'center',
          marginVertical: 20,
          color: colors.appWhite,
          fontSize: 20,
        }}>
        What's your experience level?
      </Text>
      <Button
        text="No clue what I'm doing"
        style={{
          marginBottom: 20,
          marginHorizontal: 20,
        }}
        onPress={() => setExperience(Level.BEGINNER)}
        textStyle={{fontSize: 15}}
        variant={experience === Level.BEGINNER ? 'primary' : 'secondary'}
      />
      <Button
        text="I workout every now and again"
        style={{
          marginBottom: 20,
          marginHorizontal: 20,
        }}
        onPress={() => setExperience(Level.INTERMEDIATE)}
        textStyle={{fontSize: 15}}
        variant={experience === Level.INTERMEDIATE ? 'primary' : 'secondary'}
      />
      <Button
        text="I’m a seasoned veteran"
        style={{
          marginBottom: 20,
          marginHorizontal: 20,
        }}
        onPress={() => setExperience(Level.ADVANCED)}
        textStyle={{fontSize: 15}}
        variant={experience === Level.ADVANCED ? 'primary' : 'secondary'}
      />
    </View>
  );
};

export default SelectExperience;
