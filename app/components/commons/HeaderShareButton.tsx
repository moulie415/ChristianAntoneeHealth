import React, {FunctionComponent} from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import colors from '../../constants/colors';
import DevicePixels from '../../helpers/DevicePixels';
import Exercise from '../../types/Exercise';
import {MyRootState} from '../../types/Shared';

const HeaderShareButton: FunctionComponent<{workout: Exercise[]}> = () => {
  return (
    <TouchableOpacity>
      <Icon
        color={colors.appBlue}
        size={DevicePixels[20]}
        style={{padding: DevicePixels[10]}}
        name="share-alt"
      />
    </TouchableOpacity>
  );
};

const mapStateToProps = ({exercises}: MyRootState) => ({
  workout: exercises.workout,
});

export default connect(mapStateToProps)(HeaderShareButton);
