import {TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import colors from '../../../../constants/colors';
import {MyRootState} from '../../../../types/Shared';
import {connect} from 'react-redux';

const CustomActions: React.FC<{
  attachmentsDisabled: boolean;
  onPressCamera: () => void;
}> = ({attachmentsDisabled, onPressCamera}) => {
  if (attachmentsDisabled) {
    return null;
  }
  return (
    <TouchableOpacity
      onPress={onPressCamera}
      style={{
        height: '100%',
        justifyContent: 'center',
        padding: 10,
        paddingRight: 0,
      }}>
      <Icon name="camera" size={25} color={colors.appBlue} />
    </TouchableOpacity>
  );
};

const mapStateToProps = ({settings}: MyRootState) => ({
  attachmentsDisabled: settings.attachmentsDisabled,
});

export default connect(mapStateToProps)(CustomActions);
