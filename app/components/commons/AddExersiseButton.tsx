import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import AddExerciseButtonProps from '../../types/commons/AddExerciseButton';

const AddExerciseButton: React.FC<AddExerciseButtonProps> = ({navigation}) => {
  return (
    <TouchableOpacity
      style={{padding: 10}}
      onPress={() => navigation.navigate('EditExercise', {newExercise: true})}>
      <Icon name="plus" size={20} color={colors.appBlue} />
    </TouchableOpacity>
  );
};

export default AddExerciseButton;
