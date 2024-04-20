import React from 'react';
import {TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '../../App';
import colors from '../../constants/colors';
import ExerciseListHeaderRightProps from '../../types/commons/ExerciseListHeaderRight';

import Text from './Text';

const ExerciseListHeaderRight: React.FC<ExerciseListHeaderRightProps> = ({
  workout,
  navigation,
}) => {
  return workout.length ? (
    <TouchableOpacity onPress={() => navigation.navigate('ReviewExercises')}>
      <Text
        style={{
          color: colors.appBlue,
          padding: 10,
          fontSize: 18,
        }}>
        Next
      </Text>
    </TouchableOpacity>
  ) : null;
};

const mapStateToProps = ({exercises}: RootState) => ({
  workout: exercises.workout,
});
export default connect(mapStateToProps)(ExerciseListHeaderRight);
