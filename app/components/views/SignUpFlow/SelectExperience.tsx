import React from 'react';
import { View } from 'react-native';
import colors from '../../../constants/colors';
import { Level } from '../../../types/Shared';
import SelectableButton from '../../commons/SelectableButton';
import Text from '../../commons/Text';

const experienceDetails: {
  experience: Level;
  text: string;
  secondaryText: string;
}[] = [
  {
    experience: Level.BEGINNER,
    text: 'Beginner',
    secondaryText: 'Just starting out on my health and fitness journey',
  },
  {
    experience: Level.INTERMEDIATE,
    text: 'Intermediate',
    secondaryText: 'I have some experience in the gym with weights',
  },
  {
    experience: Level.ADVANCED,
    text: 'Advanced',
    secondaryText: 'Im a seasoned veteran and want a challenge',
  },
];

const SelectExperience: React.FC<{
  experience: Level;
  setExperience: (experience: Level) => void;
}> = ({ experience, setExperience }) => {
  return (
    <View
      style={{
        flex: 1,
        marginHorizontal: 20,
        marginTop: 20,
      }}
    >
      <Text
        style={{
          marginBottom: 20,
          fontSize: 24,
          color: colors.appWhite,
          fontWeight: 'bold',
        }}
      >
        What's your level of experience?
      </Text>
      {experienceDetails.map(({ text, secondaryText, experience: e }) => {
        return (
          <SelectableButton
            key={e}
            text={text}
            secondaryText={secondaryText}
            selected={e === experience}
            onPress={() => setExperience(e)}
            style={{ marginBottom: 15 }}
          />
        );
      })}
    </View>
  );
};

export default SelectExperience;
