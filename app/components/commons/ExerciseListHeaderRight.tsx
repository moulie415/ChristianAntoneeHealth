import React from 'react';
import {TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';
import ExerciseListHeaderRightProps from '../../types/commons/ExerciseListHeaderRight';
import colors from '../../constants/colors';

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

const mapStateToProps = ({exercises}: MyRootState) => ({
  workout: exercises.workout,
});
export default connect(mapStateToProps)(ExerciseListHeaderRight);
