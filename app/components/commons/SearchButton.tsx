import React from 'react';
import styles from '../../styles/commons/SearchButton';
import SearchButtonProps from '../../types/commons/SearchButton';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';

const SearchButton: React.FC<SearchButtonProps> = ({ navigation }) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ExerciseList', {
          beginner: true,
          intermediate: true,
          advanced: true,
          strength: true,
          balance: true,
          cardiovascular: true,
          flexibility: true,
          upper: true,
          lower: true,
          full: true,
          hips: true,
          shoulders: true,
          spine: true,
        })
      }
      style={styles.container}
    >
      <Icon name="search" size={20} />
    </TouchableOpacity>
  );
};

export default SearchButton;
