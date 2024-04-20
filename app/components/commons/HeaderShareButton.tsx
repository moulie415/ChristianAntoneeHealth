import React, {FunctionComponent} from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';
import colors from '../../constants/colors';

import {RootState} from '../../App';
import {setShareModalVisible} from '../../reducers/exercises';

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

const mapStateToProps = ({exercises}: RootState) => ({
  visible: exercises.shareModalVisible,
});

const mapDispatchToProps = {
  setShareModalVisibleAction: setShareModalVisible,
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderShareButton);
