import {View, Text} from 'react-native';
import React from 'react';
import {Level} from '../../../types/Shared';

const SelectExperience: React.FC<{
  experience: Level;
  setExperience: (experience: Level) => void;
}> = ({experience, setExperience}) => {
  return (
    <View>
      <Text />
    </View>
  );
};

export default SelectExperience;
