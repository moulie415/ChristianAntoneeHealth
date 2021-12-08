import React, {FunctionComponent} from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import colors from '../../constants/colors';
import DevicePixels from '../../helpers/DevicePixels';
import {shareWorkout} from '../../helpers/exercises';
import Exercise from '../../types/Exercise';
import Profile from '../../types/Profile';
import {MyRootState} from '../../types/Shared';

const HeaderShareButton: FunctionComponent<{
  workout: Exercise[];
  profile: Profile;
}> = ({workout, profile}) => {
  return (
    <TouchableOpacity onPress={() => shareWorkout(workout, profile.name)}>
      <Icon
        color={colors.appBlue}
        size={DevicePixels[20]}
        style={{padding: DevicePixels[10]}}
        name="share-alt"
      />
    </TouchableOpacity>
  );
};

const mapStateToProps = ({exercises, profile}: MyRootState) => ({
  workout: exercises.workout,
  profile: profile.profile,
});

export default connect(mapStateToProps)(HeaderShareButton);
