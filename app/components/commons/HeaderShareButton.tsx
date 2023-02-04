import React, {FunctionComponent} from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import {setShareModalVisible} from '../../actions/exercises';
import colors from '../../constants/colors';

import {MyRootState} from '../../types/Shared';

const HeaderShareButton: FunctionComponent<{
  setShareModalVisibleAction: (payload: boolean) => void;
  visible: boolean;
}> = ({setShareModalVisibleAction, visible}) => {
  return (
    <TouchableOpacity onPress={() => setShareModalVisibleAction(!visible)}>
      <Icon
        color={colors.appBlue}
        size={20}
        style={{padding: 10}}
        name="share-alt"
      />
    </TouchableOpacity>
  );
};

const mapStateToProps = ({exercises}: MyRootState) => ({
  visible: exercises.shareModalVisible,
});

const mapDispatchToProps = {
  setShareModalVisibleAction: setShareModalVisible,
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderShareButton);
